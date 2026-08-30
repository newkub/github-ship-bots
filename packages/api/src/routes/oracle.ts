import { Hono } from "hono";
import { getSession } from "../lib/session";
import type { Env } from "@ship-feed/shared";

const oracle = new Hono<{ Bindings: Env }>();

oracle.post("/diff", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<{ a: string; b: string }>();

  if (body.a === body.b) {
    return c.json({ diffScore: 0, passed: true });
  }

  const lenA = body.a.length;
  const lenB = body.b.length;
  const max = Math.max(lenA, lenB);
  const score = Math.min(1, Math.abs(lenA - lenB) / (max || 1));
  return c.json({ diffScore: score, passed: score < 0.05 });
});

export default oracle;
