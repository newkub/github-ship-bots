import { Hono } from "hono";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import type { Env } from "@ship-feed/shared";
import { sendPushBatch } from "@mmmike/web-push/send";
import type { VapidConfig, PushSubscriptionData, PushPayload } from "@mmmike/web-push/send";

const push = new Hono<{ Bindings: Env }>();

function getVapidConfig(env: Env): VapidConfig | undefined {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY || !env.VAPID_SUBJECT) return undefined;
  return {
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
    subject: env.VAPID_SUBJECT,
  };
}

push.get("/vapid-public-key", (c) => {
  return c.json({ publicKey: c.env.VAPID_PUBLIC_KEY ?? null });
});

push.post("/subscribe", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<PushSubscriptionData>();
  const id = generateId();
  await c.env.DB.prepare(
    "INSERT OR REPLACE INTO push_subscriptions (id, user_id, endpoint, p256dh, auth, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(id, session.id, body.endpoint, body.keys.p256dh, body.keys.auth, now())
    .run();
  return c.json({ ok: true });
});

push.post("/unsubscribe", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<{ endpoint: string }>();
  await c.env.DB.prepare("DELETE FROM push_subscriptions WHERE endpoint = ?").bind(body.endpoint).run();
  return c.json({ ok: true });
});

push.post("/notify", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const vapid = getVapidConfig(c.env);
  if (!vapid) return c.json({ error: "vapid not configured" }, 503);

  const payload = await c.req.json<PushPayload>();
  const { results } = await c.env.DB
    .prepare("SELECT endpoint, p256dh, auth FROM push_subscriptions")
    .all<{ endpoint: string; p256dh: string; auth: string }>();

  const subscriptions: PushSubscriptionData[] = (results ?? []).map((row) => ({
    endpoint: row.endpoint,
    keys: { p256dh: row.p256dh, auth: row.auth },
  }));

  if (subscriptions.length === 0) {
    return c.json({ ok: true, delivered: 0 });
  }

  const result = await sendPushBatch(subscriptions, payload, vapid);
  for (const gone of result.gone) {
    await c.env.DB.prepare("DELETE FROM push_subscriptions WHERE endpoint = ?").bind(gone).run();
  }

  return c.json({ ok: true, delivered: result.delivered, gone: result.gone.length, failed: result.failed.length });
});

export default push;
