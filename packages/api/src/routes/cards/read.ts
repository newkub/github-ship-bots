import { Elysia } from "elysia";
import { getSession } from "../../lib/session";
import { explainScore } from "../../lib/score";
import { unauthorized, notFound, ensureAuth } from "../../lib/card-auth";
import { requireCard } from "../../services/card-service";
import { rowToCard } from "../../lib/card-mapper";
import { withEnv } from "../../lib/env";
import { paramsSchema } from "./schemas";

const read = withEnv(new Elysia())
  .get("/:id", async ({ request, set, env, params }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const id = params.id;
    const card = await requireCard(env.DB, session.id, id);
    if (!card) {
      set.status = 404;
      return notFound();
    }
    return card;
  }, { params: paramsSchema })

  .get("/:id/explain", async ({ request, set, env, params }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const id = params.id;
    const card = await requireCard(env.DB, session.id, id);
    if (!card) {
      set.status = 404;
      return notFound();
    }
    return explainScore(env.DB, card.repoFullName, {
      kind: card.kind,
      impact: card.impact,
      risk: card.risk,
      effect: card.effect,
      phase: card.phase,
    });
  }, { params: paramsSchema })

  .get("/:id/votes", async ({ request, set, env, params }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const id = params.id;
    const card = await requireCard(env.DB, session.id, id);
    if (!card) {
      set.status = 404;
      return notFound();
    }
    const rule = await env.DB
      .prepare("SELECT min_approvers, min_rejectors FROM approval_rules WHERE repo_full_name = ?")
      .bind(card.repoFullName)
      .first<{ min_approvers: number; min_rejectors: number }>();
    const { results } = await env.DB
      .prepare("SELECT s.direction, u.github_login as user FROM swipes s LEFT JOIN users u ON s.user_id = u.id WHERE s.card_id = ? ORDER BY s.created_at DESC")
      .bind(id)
      .all<{ direction: string; user: string }>();
    return {
      minApprovers: rule?.min_approvers ?? 1,
      minRejectors: rule?.min_rejectors ?? 1,
      votes: results ?? [],
    };
  }, { params: paramsSchema })

  .get("/:id/comments", async ({ request, set, env, params }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const id = params.id;
    const card = await requireCard(env.DB, session.id, id);
    if (!card) {
      set.status = 404;
      return notFound();
    }
    const { results } = await env.DB
      .prepare("SELECT c.*, u.github_login as user FROM card_comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.card_id = ? ORDER BY c.created_at DESC")
      .bind(id)
      .all<Record<string, unknown>>();
    return (results ?? []).map((row) => ({
      id: row.id,
      cardId: row.card_id,
      user: row.user,
      body: row.body,
      postedToGitHub: Boolean(row.posted_to_github),
      createdAt: row.created_at,
    }));
  }, { params: paramsSchema })

  .get("/:id/evidence", async ({ request, set, env, params }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const id = params.id;
    const card = await requireCard(env.DB, session.id, id);
    if (!card) {
      set.status = 404;
      return notFound();
    }
    const { results } = await env.DB.prepare("SELECT * FROM evidence WHERE card_id = ? ORDER BY created_at DESC")
      .bind(id)
      .all<Record<string, unknown>>();
    return results ?? [];
  }, { params: paramsSchema })

  .get("/", async ({ request, set, env }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const { results } = await env.DB
      .prepare(
        `SELECT * FROM cards
         WHERE creator_id = ? OR repo_full_name IN (SELECT repo_full_name FROM user_repos WHERE user_id = ?)
         ORDER BY updated_at DESC LIMIT 100`
      )
      .bind(session.id, session.id)
      .all<Record<string, unknown>>();
    return (results ?? []).map(rowToCard);
  })

  .get("/queue", async ({ request, set, env }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const { results } = await env.DB
      .prepare(
        `SELECT * FROM cards
         WHERE status IN ('pending', 'approved', 'rejected')
           AND (creator_id = ? OR repo_full_name IN (SELECT repo_full_name FROM user_repos WHERE user_id = ?))
         ORDER BY updated_at DESC LIMIT 20`
      )
      .bind(session.id, session.id)
      .all<Record<string, unknown>>();
    return (results ?? []).map(rowToCard);
  })

  .get("/nudges", async ({ request, set, env }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const { results } = await env.DB
      .prepare(
        `SELECT * FROM cards
         WHERE status = 'pending'
           AND (creator_id = ? OR repo_full_name IN (SELECT repo_full_name FROM user_repos WHERE user_id = ?))
         ORDER BY score DESC LIMIT 20`
      )
      .bind(session.id, session.id)
      .all<Record<string, unknown>>();
    return (results ?? []).map(rowToCard);
  });

export default read;
