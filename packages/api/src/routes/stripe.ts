import { Elysia } from "elysia";
import Stripe from "stripe";
import { getSession } from "../lib/session";
import { withEnv } from "../lib/env";
import { wasWebhookProcessed, recordWebhookEvent, findUserByStripeCustomer, findUserById, syncSubscription, cancelSubscription } from "../lib/stripe-service";

const plans = [
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
    features: ["Unlimited cards", "Private repos", "Evidence vault", "Priority support"],
  },
  {
    id: "team",
    name: "Team",
    price: "$49",
    features: ["Everything in Pro", "Multiple seats", "Custom CI", "SLA"],
  },
];

const stripe = withEnv(new Elysia({ prefix: "/api/stripe" }));

stripe.get("/plans", async ({ request, set, env }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  return { plans };
});

stripe.post("/checkout", async ({ request, set, env }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }

  const client = new Stripe(env.STRIPE_SECRET_KEY);
  const checkout = await client.checkout.sessions.create({
    customer_email: session.email,
    client_reference_id: session.id,
    line_items: [{ price: env.STRIPE_PRICE_PRO, quantity: 1 }],
    mode: "subscription",
    success_url: `${env.PUBLIC_APP_URL}/billing?success=1`,
    cancel_url: `${env.PUBLIC_APP_URL}/billing?canceled=1`,
  });

  return { url: checkout.url };
});

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
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        const userId = session.client_reference_id;
        if (!userId) {
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
        const sub = event.data.object as Stripe.Subscription;
        const customerId = sub.customer as string;
        const user = await findUserByStripeCustomer(env.DB, customerId);
        if (!user) break;
        await syncSubscription(env.DB, user.id, customerId, sub);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await cancelSubscription(env.DB, sub.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as unknown as { subscription?: string };
        const subscriptionId = invoice.subscription;
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
