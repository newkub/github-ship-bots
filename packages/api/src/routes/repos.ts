import { Hono } from "hono";
import { getSession } from "../lib/session";
import type { Env } from "@ship-feed/shared";

const repos = new Hono<{ Bindings: Env }>();

repos.get("/", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const { results } = await c.env.DB.prepare(
    "SELECT DISTINCT repo_full_name as name FROM cards ORDER BY repo_full_name"
  ).all<{ name: string }>();
  return c.json((results ?? []).map((r) => r.name));
});

export default repos;
