import { Elysia } from "elysia";
import { z } from "zod";
import { getSession } from "../lib/session";
import { generateId, now } from "@ship-feed/shared";
import type { ShipCard } from "@ship-feed/shared";
import { withEnv } from "../lib/env";
import { requireCard, canAccessRepo } from "../services/card-service";
import { forbidden } from "../lib/card-auth";
import { createCommentContext, postCommentToGitHub } from "@ship-feed/orchestrator";

const templates = withEnv(new Elysia({ prefix: "/api/templates" }));

templates.get("/", async ({ request, set, env, query }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  const repo = query.repo;
  if (repo && !(await canAccessRepo(env.DB, session.id, repo))) {
    set.status = 403;
    return forbidden();
  }
  const { results } = repo
    ? await env.DB.prepare("SELECT * FROM comment_templates WHERE user_id = ? AND (repo_full_name = ? OR repo_full_name IS NULL) ORDER BY name")
        .bind(session.id, repo)
        .all<Record<string, unknown>>()
    : await env.DB.prepare("SELECT * FROM comment_templates WHERE user_id = ? ORDER BY name")
        .bind(session.id)
        .all<Record<string, unknown>>();
  return (results ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    repoFullName: row.repo_full_name,
    name: row.name,
    body: row.body,
    createdAt: row.created_at,
  }));
});

templates.post("/", async ({ request, set, env, body }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  if (body.repoFullName && !(await canAccessRepo(env.DB, session.id, body.repoFullName))) {
    set.status = 403;
    return forbidden();
  }
  const id = generateId();
  await env.DB
    .prepare("INSERT INTO comment_templates (id, user_id, repo_full_name, name, body, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(id, session.id, body.repoFullName ?? null, body.name, body.body, now())
    .run();
  return { id, ok: true };
}, { body: z.object({ name: z.string(), body: z.string(), repoFullName: z.string().optional() }) });

templates.post("/:id/comment", async ({ request, set, env, params, body }) => {
  const session = await getSession({ request, set, env });
  if (!session) {
    set.status = 401;
    return { error: "unauthorized" };
  }
  const templateId = params.id;

  const template = await env.DB.prepare("SELECT * FROM comment_templates WHERE id = ? AND user_id = ?")
    .bind(templateId, session.id)
    .first<Record<string, unknown>>();
  if (!template) {
    set.status = 404;
    return { error: "template not found" };
  }

  const card = await requireCard(env.DB, body.cardId, session.id);
  if (!card) {
    set.status = 404;
    return { error: "card not found" };
  }

  const bodyText = template.body as string;
  const postedToGitHub = await postTemplateCommentToGitHub(env, card, bodyText);

  const id = generateId();
  await env.DB
    .prepare("INSERT INTO card_comments (id, card_id, user_id, template_id, body, posted_to_github, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
    .bind(id, body.cardId, session.id, templateId, bodyText, postedToGitHub ? 1 : 0, now())
    .run();

  return { id, ok: true, postedToGitHub };
}, { params: z.object({ id: z.string() }), body: z.object({ cardId: z.string() }) });

async function postTemplateCommentToGitHub(
  env: { GITHUB_APP_ID?: string; GITHUB_APP_PRIVATE_KEY?: string; GITHUB_API_URL?: string; GITHUB_WEB_URL?: string },
  card: ShipCard,
  body: string
): Promise<boolean> {
  if (!env.GITHUB_APP_ID || !env.GITHUB_APP_PRIVATE_KEY) return false;
  const ctx = createCommentContext(env);
  const result = await postCommentToGitHub(ctx, card, body);
  return result.ok;
}

export default templates;
