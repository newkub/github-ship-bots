import { Elysia } from "elysia";
import { getSession } from "../lib/session";
import { now } from "../lib/db";
import { withEnv } from "../lib/env";

const plugins = withEnv(new Elysia({ prefix: "/api/plugins" }));

plugins.get("/", async ({ request, set, env }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }

  const { results } = await env.DB.prepare("SELECT * FROM plugins ORDER BY installs DESC").all<{
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

  await env.DB.prepare("INSERT OR IGNORE INTO user_plugins (user_id, plugin_id, created_at) VALUES (?, ?, ?)")
    .bind(session.id, id, now())
    .run();

  await env.DB.prepare("UPDATE plugins SET installs = installs + 1 WHERE id = ?").bind(id).run();

  return { ok: true };
});

plugins.post("/:id/uninstall", async ({ request, set, env, params }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  const id = params.id;

  await env.DB.prepare("DELETE FROM user_plugins WHERE user_id = ? AND plugin_id = ?").bind(session.id, id).run();
  await env.DB.prepare("UPDATE plugins SET installs = MAX(0, installs - 1) WHERE id = ?").bind(id).run();

  return { ok: true };
});

export default plugins;
