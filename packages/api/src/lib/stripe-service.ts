import type Stripe from "stripe";
import type { Env } from "@ship-feed/shared";
import { generateId, now } from "./db";

export async function wasWebhookProcessed(db: Env["DB"], stripeEventId: string): Promise<boolean> {
  const row = await db
    .prepare("SELECT 1 FROM webhook_events WHERE stripe_event_id = ?")
    .bind(stripeEventId)
    .first();
  return Boolean(row);
}

export async function recordWebhookEvent(db: Env["DB"], stripeEventId: string, eventType: string): Promise<void> {
  await db
    .prepare("INSERT OR IGNORE INTO webhook_events (id, stripe_event_id, event_type, processed_at) VALUES (?, ?, ?, ?)")
    .bind(generateId(), stripeEventId, eventType, now())
    .run();
}

export async function findUserByStripeCustomer(db: Env["DB"], customerId: string): Promise<{ id: string } | null> {
  return db
    .prepare("SELECT id FROM users WHERE stripe_customer_id = ?")
    .bind(customerId)
    .first<{ id: string }>();
}

export async function findUserById(db: Env["DB"], userId: string): Promise<{ id: string } | null> {
  return db.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first<{ id: string }>();
}

function getPeriodEnd(sub: Stripe.Subscription): string | null {
  const end = (sub as unknown as { current_period_end?: number }).current_period_end;
  if (!end) return null;
  return new Date(end * 1000).toISOString();
}

export async function syncSubscription(
  db: Env["DB"],
  userId: string,
  customerId: string,
  sub: Stripe.Subscription
): Promise<void> {
  const existing = await db
    .prepare("SELECT id FROM subscriptions WHERE stripe_subscription_id = ?")
    .bind(sub.id)
    .first<{ id: string }>();

  const plan = sub.items.data[0]?.plan.nickname?.toLowerCase().includes("pro") ? "pro" : "team";
  const periodEnd = getPeriodEnd(sub);

  if (existing) {
    await db
      .prepare("UPDATE subscriptions SET plan = ?, status = ?, current_period_end = ? WHERE id = ?")
      .bind(plan, sub.status, periodEnd, existing.id)
      .run();
  } else {
    await db
      .prepare(
        "INSERT INTO subscriptions (id, user_id, stripe_subscription_id, plan, status, current_period_end) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .bind(generateId(), userId, sub.id, plan, sub.status, periodEnd)
      .run();
  }

  await db
    .prepare("UPDATE users SET plan = ?, stripe_customer_id = ? WHERE id = ?")
    .bind(plan, customerId, userId)
    .run();
}

export async function cancelSubscription(db: Env["DB"], stripeSubscriptionId: string): Promise<void> {
  await db
    .prepare("UPDATE subscriptions SET status = ?, current_period_end = ? WHERE stripe_subscription_id = ?")
    .bind("canceled", now(), stripeSubscriptionId)
    .run();

  const sub = await db
    .prepare("SELECT user_id FROM subscriptions WHERE stripe_subscription_id = ?")
    .bind(stripeSubscriptionId)
    .first<{ user_id: string }>();
  if (sub) {
    await db.prepare("UPDATE users SET plan = ? WHERE id = ?").bind("free", sub.user_id).run();
  }
}
