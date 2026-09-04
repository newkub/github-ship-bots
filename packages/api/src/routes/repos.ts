import { Elysia } from "elysia";
import { getSession } from "../lib/session";
import { withEnv } from "../lib/env";

const repos = withEnv(new Elysia({ prefix: "/api/repos" }));

repos.get("/", async ({ request, set, env }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  const { results } = await env.DB
    .prepare(
      `SELECT DISTINCT repo_full_name as name FROM user_repos
       WHERE user_id = ?
       UNION
       SELECT DISTINCT repo_full_name as name FROM cards
       WHERE creator_id = ?
       ORDER BY name`
    )
    .bind(session.id, session.id)
    .all<{ name: string }>();
  return (results ?? []).map((r) => r.name);
});

export default repos;
