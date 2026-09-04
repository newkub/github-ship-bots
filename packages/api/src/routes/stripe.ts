import { Elysia, t } from "elysia";
import Stripe from "stripe";
import { assertRecord } from "@ship-feed/shared";
import { getSession } from "../lib/session";
import { withEnv } from "../lib/env";
import { wasWebhookProcessed, recordWebhookEvent, findUserByStripeCustomer, findUserById, syncSubscription, cancelSubscription } from "../lib/stripe-service";

function getStripeStringId(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return typeof record.id === "string" ? record.id : undefined;
  }
  return undefined;
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    features: ["3 cards/day", "Public repos", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    priceIdEnv: "STRIPE_PRICE_PRO",
    features: ["Unlimited cards", "Private repos", "Evidence vault", "Priority support"],
  },
  {
    id: "team",
    name: "Team",
    price: "$49",
    priceIdEnv: "STRIPE_PRICE_TEAM",
    features: ["Everything in Pro", "Multiple seats", "Custom CI", "SLA"],
  },
];

function availablePlans(env: { STRIPE_PRICE_PRO?: string; STRIPE_PRICE_TEAM?: string }) {
  const hasPro = !!env.STRIPE_PRICE_PRO;
  const hasTeam = !!env.STRIPE_PRICE_TEAM;
  return PLANS.filter((p) => p.id === "free" || (p.id === "pro" && hasPro) || (p.id === "team" && hasTeam));
}

const stripe = withEnv(new Elysia({ prefix: "/api/stripe" }));

stripe.get("/plans", async ({ request, set, env }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  return { plans: availablePlans(env) };
});

stripe.post("/checkout", async ({ request, set, env, body }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }

  const plan = body.plan ?? "pro";
  const priceId = plan === "team" ? env.STRIPE_PRICE_TEAM : env.STRIPE_PRICE_PRO;
  if (!priceId) {
    set.status = 503;
    return { error: "service unavailable", missing: [plan === "team" ? "STRIPE_PRICE_TEAM" : "STRIPE_PRICE_PRO"] };
  }

  const client = new Stripe(env.STRIPE_SECRET_KEY);
  const checkout = await client.checkout.sessions.create({
    ...(session.email ? { customer_email: session.email } : {}),
    client_reference_id: session.id,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${env.PUBLIC_APP_URL}/billing?success=1`,
    cancel_url: `${env.PUBLIC_APP_URL}/billing?canceled=1`,
  });

  return { url: checkout.url };
}, { body: t.Object({ plan: t.Optional(t.Union([t.Literal("pro"), t.Literal("team")])) }) });

stripe.post("/webhook", async ({ request, set, env }) => {
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    set.status = 400;
    return "Missing signature";
  }

  const client = new Stripe(env.STRIPE_SECRET_KEY);
  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = client.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    set.status = 400;
    return `Webhook error: ${err instanceof Error ? err.message : String(err)}`;
  }

  if (await wasWebhookProcessed(env.DB, event.id)) {
    return { received: true, idempotent: true };
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = assertRecord(event.data.object as unknown, "checkout session");
        const customerId = getStripeStringId(session.customer);
        const subscriptionId = getStripeStringId(session.subscription);
        if (!customerId || !subscriptionId) {
          set.status = 400;
          return "Missing customer or subscription ID";
        }

        const userId = session.client_reference_id;
        if (typeof userId !== "string" || !userId) {
          set.status = 400;
          return "Missing client_reference_id";
        }

        const user = await findUserById(env.DB, userId);
        if (!user) {
          set.status = 404;
          return "User not found";
        }

        const sub = await client.subscriptions.retrieve(subscriptionId);
        await syncSubscription(env.DB, user.id, customerId, sub);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const sub = assertRecord(event.data.object as unknown, "subscription");
        const customerId = getStripeStringId(sub.customer);
        if (!customerId) break;
        const user = await findUserByStripeCustomer(env.DB, customerId);
        if (!user) break;
        await syncSubscription(env.DB, user.id, customerId, sub);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = assertRecord(event.data.object as unknown, "subscription");
        const subscriptionId = getStripeStringId(sub.id);
        if (subscriptionId) {
          await cancelSubscription(env.DB, subscriptionId);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = assertRecord(event.data.object as unknown, "invoice");
        const subscriptionId = getStripeStringId(invoice.subscription);
        if (subscriptionId) {
          await cancelSubscription(env.DB, subscriptionId);
        }
        break;
      }
    }
  } catch (err) {
    set.status = 500;
    return `Webhook processing error: ${err instanceof Error ? err.message : String(err)}`;
  }

  await recordWebhookEvent(env.DB, event.id, event.type);
  return { received: true };
});

export default stripe;
