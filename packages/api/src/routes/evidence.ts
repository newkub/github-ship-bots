import { Hono } from "hono";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import type { Env } from "@ship-feed/shared";

const evidence = new Hono<{ Bindings: Env }>();

evidence.post("/", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<{ cardId?: string; kind: string; data: string; ciRunUrl?: string }>();
  const bytes = Uint8Array.from(atob(body.data), (c) => c.charCodeAt(0));
  const key = `evidence/${generateId()}.${body.kind === "video" ? "mp4" : "png"}`;
  const sha256 = await crypto.subtle.digest("SHA-256", bytes);
  const hash = Array.from(new Uint8Array(sha256))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  await c.env.EVIDENCE_BUCKET.put(key, bytes);

  const id = generateId();
  await c.env.DB.prepare(
    "INSERT INTO evidence (id, card_id, kind, r2_key, sha256, ci_run_url, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
  )
    .bind(id, body.cardId ?? null, body.kind, key, hash, body.ciRunUrl ?? null, now())
    .run();

  return c.json({ id, key, hash });
});

evidence.get("/:id", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const id = c.req.param("id");
  const row = await c.env.DB.prepare("SELECT r2_key FROM evidence WHERE id = ?").bind(id).first<{ r2_key: string }>();
  if (!row) return c.text("Not found", 404);
  const object = await c.env.EVIDENCE_BUCKET.get(row.r2_key);
  if (!object) return c.text("Not found", 404);
  return new Response(object.body);
});

export default evidence;
