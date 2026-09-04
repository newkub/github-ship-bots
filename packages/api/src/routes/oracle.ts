import { Elysia } from "elysia";
import { z } from "zod";
import { getSession } from "../lib/session";
import { diffImages } from "../lib/oracle";
import { generateId, now } from "@ship-feed/shared";
import { withEnv } from "../lib/env";

const oracle = withEnv(new Elysia({ prefix: "/api/oracle" }));

oracle.post("/diff", async ({ request, set, env, body }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }

  try {
    const result = await diffImages(body.a, body.b, body.threshold);
    return result;
  } catch {
    set.status = 400;
    return { error: "invalid image data" };
  }
}, { body: z.object({ a: z.string(), b: z.string(), threshold: z.number().optional() }) });

oracle.post("/run", async ({ request, set, env, body }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }

  const baseline = await env.DB
    .prepare("SELECT r2_key FROM test_oracle_baselines WHERE id = ?")
    .bind(body.baselineId)
    .first<{ r2_key: string }>();
  if (!baseline) {
    set.status = 404;
    return { error: "baseline not found" };
  }

  const baselineObject = await env.BASELINE_BUCKET.get(baseline.r2_key);
  if (!baselineObject) {
    set.status = 404;
    return { error: "baseline image missing" };
  }
  const baselineBytes = new Uint8Array(await baselineObject.arrayBuffer());
  const baselineB64 = `data:image/png;base64,${btoa(String.fromCharCode(...baselineBytes))}`;

  try {
    const result = await diffImages(baselineB64, body.current, body.threshold);
    const id = generateId();
    await env.DB.prepare(
      "INSERT INTO test_oracle_results (id, baseline_id, card_id, diff_score, passed, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(id, body.baselineId, body.cardId, result.diffScore, result.passed, now())
      .run();
    return { ...result, id };
  } catch {
    set.status = 400;
    return { error: "invalid image data" };
  }
}, { body: z.object({ cardId: z.string(), baselineId: z.string(), current: z.string(), threshold: z.number().optional() }) });

oracle.get("/baselines", async ({ request, set, env }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  const { results } = await env.DB.prepare("SELECT * FROM test_oracle_baselines LIMIT 100").all<Record<string, unknown>>();
  return results ?? [];
});

export default oracle;
