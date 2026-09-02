import { Elysia } from "elysia";
import Stripe from "stripe";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import { withEnv } from "../lib/env";

const stripe = withEnv(new Elysia({ prefix: "/api/stripe" }));

stripe.post("/checkout", async ({ request, set, env }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }

  const client = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2026-08-26.dahlia" });
  const url = await client.checkout.sessions.create({
    customer_email: session.email,
    line_items: [{ price: env.STRIPE_PRICE_PRO, quantity: 1 }],
    mode: "subscription",
    success_url: `${env.PUBLIC_APP_URL}/billing?success=1`,
    cancel_url: `${env.PUBLIC_APP_URL}/billing?canceled=1`,
  });

  return { url: url.url };
});

stripe.post("/webhook", async ({ request, set, env }) => {
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    set.status = 400;
    return "Missing signature";
  }

  const client = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2026-08-26.dahlia" });
  const body = await request.text();
  let event;
  try {
    event = client.webhooks.constructEvent(body, sig, env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    set.status = 400;
    return `Webhook error: ${err instanceof Error ? err.message : String(err)}`;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;
    const sub = await client.subscriptions.retrieve(subscriptionId);

    const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(session.customer_email).first<{ id: string }>();
    if (!user) {
      set.status = 404;
      return "User not found";
    }

    const currentPeriodEnd = sub.items.data[0]?.current_period_end;
    const id = generateId();
    await env.DB.prepare(
      "INSERT INTO subscriptions (id, user_id, stripe_subscription_id, plan, status, current_period_end) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(id, user.id, subscriptionId, "pro", sub.status, currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null)
      .run();

    await env.DB.prepare("UPDATE users SET plan = ?, stripe_customer_id = ? WHERE id = ?")
      .bind("pro", customerId, user.id)
      .run();
  }

  return { received: true };
});

export default stripe;
