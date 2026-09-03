import { Elysia } from "elysia";
import { z } from "zod";
import { constantTimeCompare } from "@ship-feed/shared";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import { withEnv } from "../lib/env";

const evidence = withEnv(new Elysia({ prefix: "/api/evidence" }));

const evidenceSchema = z.object({
  cardId: z.string().optional(),
  kind: z.enum(["image", "video", "log", "diff"]),
  data: z.string(),
  ciRunUrl: z.string().optional(),
});

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
  env: { EVIDENCE_BUCKET: R2Bucket; DB: D1Database },
  body: { cardId?: string; kind: string; data: string; ciRunUrl?: string }
): Promise<{ id: string; key: string; hash: string }> {
  const bytes = base64ToBytes(body.data);
  const key = `evidence/${generateId()}.${extensionFor(body.kind)}`;
  const sha256 = await crypto.subtle.digest("SHA-256", bytes.buffer);
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

evidence.post("/", async ({ request, set, env, body }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  const result = await storeEvidence(env, body);
  return result;
}, { body: evidenceSchema });

evidence.post("/webhook", async ({ request, set, env, body }) => {
  const token = request.headers.get("x-bot-token") ?? "";
  if (!env.BOT_TOKEN || env.BOT_TOKEN.length < 32 || !(await constantTimeCompare(token, env.BOT_TOKEN))) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  const result = await storeEvidence(env, body);
  return result;
}, { body: evidenceSchema });

function contentTypeFor(kind: string) {
  if (kind === "image") return "image/png";
  if (kind === "video") return "video/mp4";
  if (kind === "diff") return "text/plain";
  if (kind === "log") return "text/plain";
  return "application/octet-stream";
}

evidence.get("/:id", async ({ request, set, env, params }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  const id = params.id;
  const row = await env.DB.prepare("SELECT r2_key, kind FROM evidence WHERE id = ?").bind(id).first<{ r2_key: string; kind: string }>();
  if (!row) {
    set.status = 404;
    return "Not found";
  }
  const object = await env.EVIDENCE_BUCKET.get(row.r2_key);
  if (!object) {
    set.status = 404;
    return "Not found";
  }
  const headers = new Headers();
  headers.set("content-type", contentTypeFor(row.kind));
  return new Response(object.body, { headers });
}, { params: z.object({ id: z.string() }) });

export default evidence;
