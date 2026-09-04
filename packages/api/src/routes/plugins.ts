import { Elysia } from "elysia";
import { getSession } from "../lib/session";
import { now } from "@ship-feed/shared";
import { withEnv } from "../lib/env";

const plugins = withEnv(new Elysia({ prefix: "/api/plugins" }));

plugins.get("/", async ({ request, set, env }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }

  const { results } = await env.DB
    .prepare(
      `SELECT p.id, p.name, p.description, p.icon, COUNT(up.user_id) as installs
       FROM plugins p
       LEFT JOIN user_plugins up ON p.id = up.plugin_id
       GROUP BY p.id
       ORDER BY installs DESC`
    )
    .all<{
      id: string;
      name: string;
      description: string;
      installs: number;
      icon: string;
    }>();

  const list = results ?? [];
  if (list.length === 0) return [];

  const { results: installed } = await env.DB.prepare(
    "SELECT plugin_id FROM user_plugins WHERE user_id = ?"
  )
    .bind(session.id)
    .all<{ plugin_id: string }>();

  const installedIds = new Set((installed ?? []).map((r) => r.plugin_id));
  return list.map((p) => ({ ...p, installed: installedIds.has(p.id) }));
});

plugins.post("/:id/install", async ({ request, set, env, params }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  const id = params.id;

  const existing = await env.DB.prepare("SELECT id FROM plugins WHERE id = ?").bind(id).first();
  if (!existing) {
    set.status = 404;
    return { error: "plugin not found" };
  }

  const alreadyInstalled = await env.DB
    .prepare("SELECT 1 FROM user_plugins WHERE user_id = ? AND plugin_id = ?")
    .bind(session.id, id)
    .first();

  if (!alreadyInstalled) {
    await env.DB.prepare("INSERT INTO user_plugins (user_id, plugin_id, created_at) VALUES (?, ?, ?)")
      .bind(session.id, id, now())
      .run();
  }

  return { ok: true };
});

plugins.post("/:id/uninstall", async ({ request, set, env, params }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  const id = params.id;

  const alreadyInstalled = await env.DB
    .prepare("SELECT 1 FROM user_plugins WHERE user_id = ? AND plugin_id = ?")
    .bind(session.id, id)
    .first();

  if (alreadyInstalled) {
    await env.DB.prepare("DELETE FROM user_plugins WHERE user_id = ? AND plugin_id = ?").bind(session.id, id).run();
  }

  return { ok: true };
});

export default plugins;
