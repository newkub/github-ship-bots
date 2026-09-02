import { Hono } from "hono";
import { getSession } from "../lib/session";
import { now } from "../lib/db";
import type { Env } from "@ship-feed/shared";

const plugins = new Hono<{ Bindings: Env }>();

plugins.get("/", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);

  const { results } = await c.env.DB.prepare("SELECT * FROM plugins ORDER BY installs DESC").all<{
    id: string;
    name: string;
    description: string;
    installs: number;
    icon: string;
  }>();

  const list = results ?? [];
  if (list.length === 0) return c.json([]);

  const { results: installed } = await c.env.DB.prepare(
    "SELECT plugin_id FROM user_plugins WHERE user_id = ?"
  )
    .bind(session.id)
    .all<{ plugin_id: string }>();

  const installedIds = new Set((installed ?? []).map((r) => r.plugin_id));
  return c.json(list.map((p) => ({ ...p, installed: installedIds.has(p.id) })));
});

plugins.post("/:id/install", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const id = c.req.param("id");

  const existing = await c.env.DB.prepare("SELECT id FROM plugins WHERE id = ?").bind(id).first();
  if (!existing) return c.json({ error: "plugin not found" }, 404);

  await c.env.DB.prepare("INSERT OR IGNORE INTO user_plugins (user_id, plugin_id, created_at) VALUES (?, ?, ?)")
    .bind(session.id, id, now())
    .run();

  await c.env.DB.prepare("UPDATE plugins SET installs = installs + 1 WHERE id = ?").bind(id).run();

  return c.json({ ok: true });
});

plugins.post("/:id/uninstall", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const id = c.req.param("id");

  await c.env.DB.prepare("DELETE FROM user_plugins WHERE user_id = ? AND plugin_id = ?").bind(session.id, id).run();
  await c.env.DB.prepare("UPDATE plugins SET installs = MAX(0, installs - 1) WHERE id = ?").bind(id).run();

  return c.json({ ok: true });
});

export default plugins;
