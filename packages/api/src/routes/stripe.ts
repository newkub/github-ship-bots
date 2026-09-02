import { Hono } from "hono";
import Stripe from "stripe";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import type { Env } from "@ship-feed/shared";

const stripe = new Hono<{ Bindings: Env }>();

stripe.post("/checkout", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);

  const client = new Stripe(c.env.STRIPE_SECRET_KEY, { apiVersion: "2026-08-26.dahlia" });
  const url = await client.checkout.sessions.create({
    customer_email: session.email,
    line_items: [{ price: c.env.STRIPE_PRICE_PRO, quantity: 1 }],
    mode: "subscription",
    success_url: `${c.env.PUBLIC_APP_URL}/billing?success=1`,
    cancel_url: `${c.env.PUBLIC_APP_URL}/billing?canceled=1`,
  });

  return c.json({ url: url.url });
});

stripe.post("/webhook", async (c) => {
  const sig = c.req.header("stripe-signature");
  if (!sig) return c.text("Missing signature", 400);

  const client = new Stripe(c.env.STRIPE_SECRET_KEY, { apiVersion: "2026-08-26.dahlia" });
  const body = await c.req.text();
  let event;
  try {
    event = client.webhooks.constructEvent(body, sig, c.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return c.text(`Webhook error: ${err instanceof Error ? err.message : String(err)}`, 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;
    const sub = await client.subscriptions.retrieve(subscriptionId);

    const user = await c.env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(session.customer_email).first<{ id: string }>();
    if (!user) return c.text("User not found", 404);

    const currentPeriodEnd = sub.items.data[0]?.current_period_end;
    const id = generateId();
    await c.env.DB.prepare(
      "INSERT INTO subscriptions (id, user_id, stripe_subscription_id, plan, status, current_period_end) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(id, user.id, subscriptionId, "pro", sub.status, currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null)
      .run();

    await c.env.DB.prepare("UPDATE users SET plan = ?, stripe_customer_id = ? WHERE id = ?")
      .bind("pro", customerId, user.id)
      .run();
  }

  return c.json({ received: true });
});

export default stripe;
