import { Hono } from "hono";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import type { Env } from "@ship-feed/shared";

const inspector = new Hono<{ Bindings: Env }>();

inspector.post("/", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<{ url: string; selector: string; prompt: string }>();
  const id = generateId();
  await c.env.DB.prepare(
    "INSERT INTO inspector_annotations (id, url, selector, prompt, created_at) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(id, body.url, body.selector, body.prompt, now())
    .run();
  return c.json({ ok: true, id, message: "Inspector annotation queued. Devin will run the prompt and open a PR." });
});

export default inspector;
