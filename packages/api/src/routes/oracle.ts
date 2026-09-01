import { Hono } from "hono";
import { getSession } from "../lib/session";
import { diffImages } from "../lib/oracle";
import { generateId, now } from "../lib/db";
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

oracle.post("/run", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<{
    cardId: string;
    baselineId: string;
    current: string;
    threshold?: number;
  }>();

  const baseline = await c.env.DB
    .prepare("SELECT r2_key FROM test_oracle_baselines WHERE id = ?")
    .bind(body.baselineId)
    .first<{ r2_key: string }>();
  if (!baseline) return c.json({ error: "baseline not found" }, 404);

  const baselineObject = await c.env.BASELINE_BUCKET.get(baseline.r2_key);
  if (!baselineObject) return c.json({ error: "baseline image missing" }, 404);
  const baselineBytes = new Uint8Array(await baselineObject.arrayBuffer());
  const baselineB64 = `data:image/png;base64,${btoa(String.fromCharCode(...baselineBytes))}`;

  try {
    const result = await diffImages(baselineB64, body.current, body.threshold);
    const id = generateId();
    await c.env.DB.prepare(
      "INSERT INTO test_oracle_results (id, baseline_id, card_id, diff_score, passed, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(id, body.baselineId, body.cardId, result.diffScore, result.passed, now())
      .run();
    return c.json({ ...result, id });
  } catch {
    return c.json({ error: "invalid image data" }, 400);
  }
});

oracle.get("/baselines", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const { results } = await c.env.DB.prepare("SELECT * FROM test_oracle_baselines LIMIT 100").all<Record<string, unknown>>();
  return c.json(results ?? []);
});

export default oracle;
