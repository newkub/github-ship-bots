import { Elysia } from "elysia";
import { z } from "zod";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import { withEnv } from "../lib/env";
import { sendPushBatch } from "@mmmike/web-push/send";
import type { VapidConfig, PushSubscriptionData, PushPayload } from "@mmmike/web-push/send";

const push = withEnv(new Elysia({ prefix: "/api/push" }));

function getVapidConfig(env: { VAPID_PUBLIC_KEY?: string; VAPID_PRIVATE_KEY?: string; VAPID_SUBJECT?: string }): VapidConfig | undefined {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY || !env.VAPID_SUBJECT) return undefined;
  return {
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
    subject: env.VAPID_SUBJECT,
  };
}

push.get("/vapid-public-key", ({ env }) => {
  return { publicKey: env.VAPID_PUBLIC_KEY ?? null };
});

const subscriptionSchema = z.object({
  endpoint: z.string(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

push.post("/subscribe", async ({ request, set, env, body }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  const id = generateId();
  await env.DB.prepare(
    "INSERT OR REPLACE INTO push_subscriptions (id, user_id, endpoint, p256dh, auth, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(id, session.id, body.endpoint, body.keys.p256dh, body.keys.auth, now())
    .run();
  return { ok: true };
}, { body: subscriptionSchema });

push.post("/unsubscribe", async ({ request, set, env, body }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  await env.DB.prepare("DELETE FROM push_subscriptions WHERE endpoint = ?").bind(body.endpoint).run();
  return { ok: true };
}, { body: z.object({ endpoint: z.string() }) });

const pushPayloadSchema = z.object({
  title: z.string(),
  body: z.string().optional(),
  url: z.string().optional(),
  tag: z.string().optional(),
}) as z.ZodType<PushPayload>;

push.post("/notify", async ({ request, set, env, body }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  const vapid = getVapidConfig(env);
  if (!vapid) {
    set.status = 503;
    return { error: "vapid not configured" };
  }

  const { results } = await env.DB
    .prepare("SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ?")
    .bind(session.id)
    .all<{ endpoint: string; p256dh: string; auth: string }>();

  const subscriptions: PushSubscriptionData[] = (results ?? []).map((row) => ({
    endpoint: row.endpoint,
    keys: { p256dh: row.p256dh, auth: row.auth },
  }));

  if (subscriptions.length === 0) {
    return { ok: true, delivered: 0 };
  }

  const result = await sendPushBatch(subscriptions, body, vapid);
  for (const gone of result.gone) {
    await env.DB.prepare("DELETE FROM push_subscriptions WHERE endpoint = ?").bind(gone).run();
  }

  return { ok: true, delivered: result.delivered, gone: result.gone.length, failed: result.failed.length };
}, { body: pushPayloadSchema });

export default push;
