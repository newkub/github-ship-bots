import { Hono } from "hono";
import { getSession } from "../lib/session";
import { diffImages } from "../lib/oracle";
import type { Env } from "@ship-feed/shared";

const oracle = new Hono<{ Bindings: Env }>();

oracle.post("/diff", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<{ a: string; b: string; threshold?: number }>();

  try {
    const result = await diffImages(body.a, body.b, body.threshold);
    return c.json(result);
  } catch {
    return c.json({ error: "invalid image data" }, 400);
  }
});

export default oracle;
