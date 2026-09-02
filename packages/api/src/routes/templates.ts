import { Hono } from "hono";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import type { Env } from "@ship-feed/shared";

const templates = new Hono<{ Bindings: Env }>();

templates.get("/", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const repo = c.req.query("repo");
  const { results } = repo
    ? await c.env.DB.prepare("SELECT * FROM comment_templates WHERE user_id = ? AND (repo_full_name = ? OR repo_full_name IS NULL) ORDER BY name")
        .bind(session.id, repo)
        .all<Record<string, unknown>>()
    : await c.env.DB.prepare("SELECT * FROM comment_templates WHERE user_id = ? ORDER BY name")
        .bind(session.id)
        .all<Record<string, unknown>>();
  return c.json((results ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    repoFullName: row.repo_full_name,
    name: row.name,
    body: row.body,
    createdAt: row.created_at,
  })));
});

templates.post("/", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<{ name: string; body: string; repoFullName?: string }>();
  const id = generateId();
  await c.env.DB
    .prepare("INSERT INTO comment_templates (id, user_id, repo_full_name, name, body, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(id, session.id, body.repoFullName ?? null, body.name, body.body, now())
    .run();
  return c.json({ id, ok: true });
});

templates.post("/:id/comment", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const templateId = c.req.param("id");
  const { cardId } = await c.req.json<{ cardId: string }>();

  const template = await c.env.DB.prepare("SELECT * FROM comment_templates WHERE id = ? AND user_id = ?")
    .bind(templateId, session.id)
    .first<Record<string, unknown>>();
  if (!template) return c.json({ error: "template not found" }, 404);

  const id = generateId();
  await c.env.DB
    .prepare("INSERT INTO card_comments (id, card_id, user_id, template_id, body, posted_to_github, created_at) VALUES (?, ?, ?, ?, ?, 0, ?)")
    .bind(id, cardId, session.id, templateId, template.body as string, now())
    .run();

  return c.json({ id, ok: true });
});

export default templates;
