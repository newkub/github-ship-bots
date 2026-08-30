import { Hono } from "hono";
import { getSession } from "../lib/session";
import { now } from "../lib/db";
import type { Env } from "@ship-feed/shared";

const learning = new Hono<{ Bindings: Env }>();

learning.get("/weights", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const repo = c.req.query("repo");
  const { results } = repo
    ? await c.env.DB.prepare("SELECT * FROM learning_weights WHERE repo_full_name = ?").bind(repo).all()
    : await c.env.DB.prepare("SELECT * FROM learning_weights").all();
  return c.json(results);
});

learning.post("/weights", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<{ repoFullName: string; feature: string; weight: number }>();
  await c.env.DB.prepare(
    "INSERT OR REPLACE INTO learning_weights (repo_full_name, feature, weight, updated_at) VALUES (?, ?, ?, ?)"
  )
    .bind(body.repoFullName, body.feature, body.weight, now())
    .run();
  return c.json({ ok: true });
});

export default learning;
