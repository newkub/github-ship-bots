import { Elysia } from "elysia";
import { z } from "zod";
import { getSession } from "../lib/session";
import { now } from "@ship-feed/shared";
import { withEnv } from "../lib/env";

import type { Env } from "@ship-feed/shared";

async function loadUserRepoNames(db: Env["DB"], userId: string): Promise<string[]> {
  const { results } = await db
    .prepare("SELECT repo_full_name FROM user_repos WHERE user_id = ?")
    .bind(userId)
    .all<{ repo_full_name: string }>();
  return (results ?? []).map((r) => r.repo_full_name);
}

const learning = withEnv(new Elysia({ prefix: "/api/learning" }));

learning.get("/weights", async ({ request, set, env, query }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  const accessible = await loadUserRepoNames(env.DB, session.id);
  const repo = query.repo;
  if (repo) {
    if (!accessible.includes(repo)) {
      set.status = 403;
      return { error: "forbidden" };
    }
    const { results } = await env.DB.prepare("SELECT * FROM learning_weights WHERE repo_full_name = ?").bind(repo).all();
    return results;
  }
  if (accessible.length === 0) return [];
  const placeholders = accessible.map(() => "?").join(",");
  const { results } = await env.DB
    .prepare(`SELECT * FROM learning_weights WHERE repo_full_name IN (${placeholders})`)
    .bind(...accessible)
    .all();
  return results;
});

learning.post("/weights", async ({ request, set, env, body }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  const accessible = await loadUserRepoNames(env.DB, session.id);
  if (!accessible.includes(body.repoFullName)) {
    set.status = 403;
    return { error: "forbidden" };
  }
  await env.DB.prepare(
    "INSERT OR REPLACE INTO learning_weights (repo_full_name, feature, weight, updated_at) VALUES (?, ?, ?, ?)"
  )
    .bind(body.repoFullName, body.feature, body.weight, now())
    .run();
  return { ok: true };
}, { body: z.object({ repoFullName: z.string(), feature: z.string(), weight: z.number() }) });

export default learning;
