import { Hono } from "hono";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import type { Env } from "@ship-feed/shared";

const evidence = new Hono<{ Bindings: Env }>();

function base64ToBytes(base64: string) {
  const clean = base64.replace(/^data:[^;]+;base64,/, "");
  return Uint8Array.from(atob(clean), (c) => c.charCodeAt(0));
}

function extensionFor(kind: string) {
  if (kind === "video") return "mp4";
  if (kind === "log") return "log";
  if (kind === "diff") return "diff";
  return "png";
}

async function storeEvidence(
  env: Env,
  body: { cardId?: string; kind: string; data: string; ciRunUrl?: string }
): Promise<{ id: string; key: string; hash: string }> {
  const bytes = base64ToBytes(body.data);
  const key = `evidence/${generateId()}.${extensionFor(body.kind)}`;
  const sha256 = await crypto.subtle.digest("SHA-256", bytes);
  const hash = Array.from(new Uint8Array(sha256))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  await env.EVIDENCE_BUCKET.put(key, bytes);

  const id = generateId();
  await env.DB.prepare(
    "INSERT INTO evidence (id, card_id, kind, r2_key, sha256, ci_run_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(id, body.cardId ?? null, body.kind, key, hash, body.ciRunUrl ?? null, now())
    .run();

  return { id, key, hash };
}

evidence.post("/", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<{ cardId?: string; kind: string; data: string; ciRunUrl?: string }>();
  const result = await storeEvidence(c.env, body);
  return c.json(result);
});

evidence.post("/webhook", async (c) => {
  const token = c.req.header("x-bot-token");
  if (!c.env.BOT_TOKEN || token !== c.env.BOT_TOKEN) {
    return c.json({ error: "unauthorized" }, 401);
  }
  const body = await c.req.json<{ cardId?: string; kind: string; data: string; ciRunUrl?: string }>();
  const result = await storeEvidence(c.env, body);
  return c.json(result);
});

function contentTypeFor(kind: string) {
  if (kind === "image") return "image/png";
  if (kind === "video") return "video/mp4";
  if (kind === "diff") return "text/plain";
  if (kind === "log") return "text/plain";
  return "application/octet-stream";
}

evidence.get("/:id", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const id = c.req.param("id");
  const row = await c.env.DB.prepare("SELECT r2_key, kind FROM evidence WHERE id = ?").bind(id).first<{ r2_key: string; kind: string }>();
  if (!row) return c.text("Not found", 404);
  const object = await c.env.EVIDENCE_BUCKET.get(row.r2_key);
  if (!object) return c.text("Not found", 404);
  const headers = new Headers();
  headers.set("content-type", contentTypeFor(row.kind));
  return new Response(object.body, { headers });
});

export default evidence;
