import { Elysia, t } from "elysia";
import { getSession } from "../../lib/session";
import { explainScore } from "../../lib/score";
import { unauthorized, notFound, ensureAuth } from "../../lib/card-auth";
import { getApprovalRule } from "../../lib/approval";
import { requireCard } from "../../services/card-service";
import { rowToCard } from "../../lib/card-mapper";
import { withEnv } from "../../lib/env";
import { paramsSchema } from "./schemas";
import { assertEvidenceRecord, type CardComment } from "@ship-feed/shared";

const read = withEnv(new Elysia())
  .get("/:id", async ({ request, set, env, params }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const id = params.id;
    const card = await requireCard(env.DB, id, session.id);
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
    const card = await requireCard(env.DB, id, session.id);
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
    const card = await requireCard(env.DB, id, session.id);
    if (!card) {
      set.status = 404;
      return notFound();
    }
    const rule = await getApprovalRule(env.DB, card.repoFullName);
    const { results } = await env.DB
      .prepare("SELECT s.direction, u.github_login as user FROM swipes s LEFT JOIN users u ON s.user_id = u.id WHERE s.card_id = ? ORDER BY s.created_at DESC")
      .bind(id)
      .all<{ direction: string; user: string }>();
    return {
      minApprovers: rule.minApprovers,
      minRejectors: rule.minRejectors,
      voteWeight: rule.voteWeight,
      vetoEnabled: rule.vetoEnabled,
      votes: results ?? [],
    };
  }, { params: paramsSchema })

  .get("/:id/comments", async ({ request, set, env, params }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const id = params.id;
    const card = await requireCard(env.DB, id, session.id);
    if (!card) {
      set.status = 404;
      return notFound();
    }
    const { results } = await env.DB
      .prepare("SELECT c.*, u.github_login as user FROM card_comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.card_id = ? ORDER BY c.created_at DESC")
      .bind(id)
      .all<CardComment>();
    return (results ?? []).map((row) => ({
      id: row.id,
      cardId: row.cardId,
      user: row.user,
      body: row.body,
      postedToGitHub: Boolean(row.postedToGitHub),
      createdAt: row.createdAt,
    }));
  }, { params: paramsSchema })

  .get("/:id/evidence", async ({ request, set, env, params, query }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const id = params.id;
    const card = await requireCard(env.DB, id, session.id);
    if (!card) {
      set.status = 404;
      return notFound();
    }
    const tags = typeof query.tags === "string" ? query.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const { results } = await env.DB.prepare("SELECT * FROM evidence WHERE card_id = ? ORDER BY created_at DESC")
      .bind(id)
      .all<Record<string, unknown>>();
    const records = (results ?? []).map((row) =>
      assertEvidenceRecord({
        id: row.id,
        cardId: row.card_id,
        kind: row.kind,
        r2Key: row.r2_key,
        sha256: row.sha256,
        ciRunUrl: row.ci_run_url,
        tags: row.tags,
        createdAt: row.created_at,
      })
    );
    if (tags.length === 0) return records;
    return records.filter((r) => tags.some((t) => r.tags.includes(t)));
  }, { params: paramsSchema, query: t.Object({ tags: t.Optional(t.String()) }) })

  .get("/", async ({ request, set, env }) => {
    const session = await getSession({ request, set, env });
    if (!ensureAuth(set, session)) return unauthorized();
    const { results } = await env.DB
      .prepare(
        `WITH visible AS (
          SELECT id FROM cards WHERE creator_id = ?
          UNION
          SELECT c.id FROM cards c
          JOIN user_repos ur ON ur.repo_full_name = c.repo_full_name
          WHERE ur.user_id = ?
        )
        SELECT c.* FROM cards c
        JOIN visible v ON c.id = v.id
        ORDER BY c.updated_at DESC LIMIT 100`
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
        `WITH visible AS (
          SELECT id FROM cards WHERE creator_id = ?
          UNION
          SELECT c.id FROM cards c
          JOIN user_repos ur ON ur.repo_full_name = c.repo_full_name
          WHERE ur.user_id = ?
        )
        SELECT c.* FROM cards c
        JOIN visible v ON c.id = v.id
        WHERE c.status IN ('pending', 'approved', 'rejected')
        ORDER BY c.updated_at DESC LIMIT 20`
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
        `WITH visible AS (
          SELECT id FROM cards WHERE creator_id = ?
          UNION
          SELECT c.id FROM cards c
          JOIN user_repos ur ON ur.repo_full_name = c.repo_full_name
          WHERE ur.user_id = ?
        )
        SELECT c.* FROM cards c
        JOIN visible v ON c.id = v.id
        WHERE c.status = 'pending'
        ORDER BY c.score DESC LIMIT 20`
      )
      .bind(session.id, session.id)
      .all<Record<string, unknown>>();
    return (results ?? []).map(rowToCard);
  });

export default read;
