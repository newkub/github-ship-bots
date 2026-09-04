import type Stripe from "stripe";
import type { Env } from "@ship-feed/shared";
import { generateId, now, assertRecord } from "@ship-feed/shared";

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

function getPeriodEnd(sub: unknown): string | null {
  const record = assertRecord(sub, "Stripe subscription");
  const end = record.current_period_end;
  if (typeof end !== "number" || Number.isNaN(end)) return null;
  return new Date(end * 1000).toISOString();
}

function getPlanNickname(record: Record<string, unknown>): string {
  const items = record.items;
  if (items === null || typeof items !== "object") return "team";
  const itemsRecord = assertRecord(items, "subscription items");
  const data = itemsRecord.data;
  if (!Array.isArray(data) || data.length === 0) return "team";
  const first = data[0];
  if (first === null || typeof first !== "object") return "team";
  const firstRecord = assertRecord(first, "subscription item");
  const plan = firstRecord.plan;
  if (plan === null || typeof plan !== "object") return "team";
  const planRecord = assertRecord(plan, "plan");
  const nickname = planRecord.nickname;
  return typeof nickname === "string" && nickname.toLowerCase().includes("pro") ? "pro" : "team";
}

export async function syncSubscription(
  db: Env["DB"],
  userId: string,
  customerId: string,
  sub: unknown
): Promise<void> {
  const record = assertRecord(sub, "Stripe subscription");
  const subscriptionId = typeof record.id === "string" ? record.id : undefined;
  const status = typeof record.status === "string" ? record.status : undefined;
  if (!subscriptionId) throw new Error("Missing subscription id");
  if (!status) throw new Error("Missing subscription status");

  const existing = await db
    .prepare("SELECT id FROM subscriptions WHERE stripe_subscription_id = ?")
    .bind(subscriptionId)
    .first<{ id: string }>();

  const plan = getPlanNickname(record);
  const periodEnd = getPeriodEnd(record);

  if (existing) {
    await db
      .prepare("UPDATE subscriptions SET plan = ?, status = ?, current_period_end = ? WHERE id = ?")
      .bind(plan, status, periodEnd, existing.id)
      .run();
  } else {
    await db
      .prepare(
        "INSERT INTO subscriptions (id, user_id, stripe_subscription_id, plan, status, current_period_end) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .bind(generateId(), userId, subscriptionId, plan, status, periodEnd)
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
