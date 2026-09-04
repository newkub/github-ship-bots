import { Elysia, t } from "elysia";
import { generateId, now } from "@ship-feed/shared";
import { getSession } from "../lib/session";
import { withEnv } from "../lib/env";
import { logError, logInfo } from "@ship-feed/shared";

const integrations = withEnv(new Elysia({ prefix: "/api" }));

function generateToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return "sf_" + Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function parseJsonArray(value: string | null, fallback: string[]): string[] {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((s): s is string => typeof s === "string");
  } catch {
    return fallback;
  }
  return fallback;
}

const tokenSchema = t.Object({
  name: t.String({ minLength: 1 }),
  scopes: t.Optional(t.Array(t.String())),
});

const webhookSchema = t.Object({
  url: t.String({ minLength: 1 }),
  events: t.Array(t.String()),
});

const paramsSchema = t.Object({ id: t.String() });

integrations
  .get("/tokens", async ({ request, set, env }) => {
    const session = await getSession({ request, set, env });
    if (!session) {
      set.status = 401;
      return { error: "unauthorized" };
    }
    const { results } = await env.DB
      .prepare("SELECT id, name, scopes, created_at, last_used_at FROM api_tokens WHERE user_id = ? ORDER BY created_at DESC")
      .bind(session.id)
      .all<Record<string, unknown>>();
    return (results ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      scopes: parseJsonArray(row.scopes as string, ["read:cards"]),
      createdAt: row.created_at,
      lastUsedAt: row.last_used_at,
    }));
  })

  .post("/tokens", async ({ request, set, env, body }) => {
    const session = await getSession({ request, set, env });
    if (!session) {
      set.status = 401;
      return { error: "unauthorized" };
    }
    const token = generateToken();
    const hash = await sha256Hex(token);
    const scopes = JSON.stringify(body.scopes && body.scopes.length > 0 ? body.scopes : ["read:cards"]);
    const id = generateId();
    await env.DB
      .prepare("INSERT INTO api_tokens (id, user_id, name, token_hash, scopes, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(id, session.id, body.name, hash, scopes, now())
      .run();
    return { id, name: body.name, scopes: parseJsonArray(scopes, ["read:cards"]), createdAt: now(), token };
  }, { body: tokenSchema })

  .delete("/tokens/:id", async ({ request, set, env, params }) => {
    const session = await getSession({ request, set, env });
    if (!session) {
      set.status = 401;
      return { error: "unauthorized" };
    }
    await env.DB.prepare("DELETE FROM api_tokens WHERE id = ? AND user_id = ?").bind(params.id, session.id).run();
    return { ok: true };
  }, { params: paramsSchema })

  .get("/webhooks", async ({ request, set, env }) => {
    const session = await getSession({ request, set, env });
    if (!session) {
      set.status = 401;
      return { error: "unauthorized" };
    }
    const { results } = await env.DB
      .prepare("SELECT id, url, events, created_at FROM webhook_subscriptions WHERE user_id = ? ORDER BY created_at DESC")
      .bind(session.id)
      .all<Record<string, unknown>>();
    return (results ?? []).map((row) => ({
      id: row.id,
      url: row.url,
      events: parseJsonArray(row.events as string, ["card.status_changed"]),
      createdAt: row.created_at,
    }));
  })

  .post("/webhooks", async ({ request, set, env, body }) => {
    const session = await getSession({ request, set, env });
    if (!session) {
      set.status = 401;
      return { error: "unauthorized" };
    }
    const secret = generateToken();
    const events = JSON.stringify(body.events);
    const id = generateId();
    await env.DB
      .prepare("INSERT INTO webhook_subscriptions (id, user_id, url, events, secret, created_at) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(id, session.id, body.url, events, secret, now())
      .run();
    return { id, url: body.url, events: body.events, createdAt: now(), secret };
  }, { body: webhookSchema })

  .delete("/webhooks/:id", async ({ request, set, env, params }) => {
    const session = await getSession({ request, set, env });
    if (!session) {
      set.status = 401;
      return { error: "unauthorized" };
    }
    await env.DB.prepare("DELETE FROM webhook_subscriptions WHERE id = ? AND user_id = ?").bind(params.id, session.id).run();
    return { ok: true };
  }, { params: paramsSchema });

export default integrations;

export async function deliverCardStatusWebhook(
  env: { DB: D1Database },
  event: { event: string; cardId: string; status: string; repoFullName: string; title: string },
  correlationId: string
): Promise<void> {
  const { results } = await env.DB
    .prepare("SELECT url, events, secret FROM webhook_subscriptions")
    .all<Record<string, unknown>>();
  const subscriptions = results ?? [];
  for (const row of subscriptions) {
    const events = parseJsonArray(row.events as string, ["card.status_changed"]);
    if (!events.includes(event.event)) continue;
    const url = row.url as string;
    const secret = row.secret as string;
    const payload = JSON.stringify(event);
    const signature = await hmacSha256Hex(secret, payload);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-ship-feed-signature": signature,
          "x-ship-feed-event": event.event,
          "x-ship-feed-delivery": generateId(),
        },
        body: payload,
      });
      if (!res.ok) {
        logError({ type: "webhook_delivery_failed", correlationId, url, status: res.status, event });
      } else {
        logInfo({ type: "webhook_delivered", correlationId, url, event });
      }
    } catch (err) {
      logError({ type: "webhook_delivery_error", correlationId, url, event, error: err instanceof Error ? err.message : String(err) });
    }
  }
}

async function hmacSha256Hex(secret: string, payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
