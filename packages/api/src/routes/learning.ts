import { Elysia } from "elysia";
import { z } from "zod";
import { getSession } from "../lib/session";
import { now } from "../lib/db";
import { withEnv } from "../lib/env";

const learning = withEnv(new Elysia({ prefix: "/api/learning" }));

learning.get("/weights", async ({ request, set, env, query }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  const repo = query.repo;
  const { results } = repo
    ? await env.DB.prepare("SELECT * FROM learning_weights WHERE repo_full_name = ?").bind(repo).all()
    : await env.DB.prepare("SELECT * FROM learning_weights").all();
  return results;
});

learning.post("/weights", async ({ request, set, env, body }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  await env.DB.prepare(
    "INSERT OR REPLACE INTO learning_weights (repo_full_name, feature, weight, updated_at) VALUES (?, ?, ?, ?)"
  )
    .bind(body.repoFullName, body.feature, body.weight, now())
    .run();
  return { ok: true };
}, { body: z.object({ repoFullName: z.string(), feature: z.string(), weight: z.number() }) });

export default learning;
