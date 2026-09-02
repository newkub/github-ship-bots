import { Elysia } from "elysia";
import { z } from "zod";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import { withEnv } from "../lib/env";
import { updateLearningWeights } from "../lib/learning";
import { autoScore, explainScore } from "../lib/score";
import { resolveApprovalStatus } from "../lib/approval";
import { notifyCardStatus } from "../lib/notify";
import { createContext, onApprove, onReject } from "@ship-feed/orchestrator";
import type { Env, ShipCard, SwipeEvent } from "@ship-feed/shared";

const cards = withEnv(new Elysia({ prefix: "/api/cards" }));

const impactSchema = z.enum(["high", "medium", "low"]);
const riskSchema = z.enum(["high", "medium", "low"]);
const effectSchema = z.enum(["high", "medium", "low"]);
const phaseSchema = z.enum(["mvp", "v2", "done"]);
const kindSchema = z.enum(["idea", "work", "merge", "release"]);
const statusSchema = z.enum(["pending", "approved", "rejected", "shipped"]);

const directionSchema = z.enum(["approve", "reject"]);

const cardInputSchema = z.object({
  kind: kindSchema,
  title: z.string(),
  description: z.string(),
  repoFullName: z.string(),
  issueNumber: z.number().optional(),
  pullNumber: z.number().optional(),
  impact: impactSchema.default("medium"),
  risk: riskSchema.default("medium"),
  effect: effectSchema.default("medium"),
  phase: phaseSchema.default("mvp"),
});

function rowToCard(row: Record<string, unknown>): ShipCard {
  return {
    id: row.id as string,
    kind: row.kind as ShipCard["kind"],
    title: row.title as string,
    description: row.description as string,
    status: row.status as ShipCard["status"],
    repoFullName: row.repo_full_name as string,
    issueNumber: row.issue_number as number | undefined,
    pullNumber: row.pull_number as number | undefined,
    impact: row.impact as ShipCard["impact"],
    risk: row.risk as ShipCard["risk"],
    effect: row.effect as ShipCard["effect"],
    phase: row.phase as ShipCard["phase"],
    score: row.score as number,
    evidenceIds: JSON.parse((row.evidence_ids as string) || "[]"),
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

async function fetchCardById(db: Env["DB"], id: string): Promise<ShipCard | undefined> {
  const row = await db.prepare("SELECT * FROM cards WHERE id = ?").bind(id).first<Record<string, unknown>>();
  if (!row) return undefined;
  return rowToCard(row);
}

function unauthorized() {
  return { error: "unauthorized" };
}

function notFound() {
  return { error: "card not found" };
}

function ensureAuth(
  set: { status?: number | string },
  user: Awaited<ReturnType<typeof getSession>>
): user is NonNullable<typeof user> {
  if (!user) {
    set.status = 401;
    return false;
  }
  return true;
}

cards.get("/:id", async ({ request, set, env, params }) => {
  const session = await getSession({ request, set, env });
  if (!ensureAuth(set, session)) return unauthorized();
  const id = params.id;
  const card = await fetchCardById(env.DB, id);
  if (!card) {
    set.status = 404;
    return notFound();
  }
  return card;
}, { params: z.object({ id: z.string() }) });

cards.get("/:id/explain", async ({ request, set, env, params }) => {
  const session = await getSession({ request, set, env });
  if (!ensureAuth(set, session)) return unauthorized();
  const id = params.id;
  const card = await fetchCardById(env.DB, id);
  if (!card) {
    set.status = 404;
    return notFound();
  }

  const explanation = await explainScore(env.DB, card.repoFullName, {
    kind: card.kind,
    impact: card.impact,
    risk: card.risk,
    effect: card.effect,
    phase: card.phase,
  });

  return explanation;
}, { params: z.object({ id: z.string() }) });

cards.get("/:id/votes", async ({ request, set, env, params }) => {
  const session = await getSession({ request, set, env });
  if (!ensureAuth(set, session)) return unauthorized();
  const id = params.id;
  const card = await fetchCardById(env.DB, id);
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
}, { params: z.object({ id: z.string() }) });

cards.get("/:id/comments", async ({ request, set, env, params }) => {
  const session = await getSession({ request, set, env });
  if (!ensureAuth(set, session)) return unauthorized();
  const id = params.id;
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
}, { params: z.object({ id: z.string() }) });

cards.get("/:id/evidence", async ({ request, set, env, params }) => {
  const session = await getSession({ request, set, env });
  if (!ensureAuth(set, session)) return unauthorized();
  const id = params.id;
  const card = await fetchCardById(env.DB, id);
  if (!card) {
    set.status = 404;
    return notFound();
  }
  const { results } = await env.DB.prepare("SELECT * FROM evidence WHERE card_id = ? ORDER BY created_at DESC")
    .bind(id)
    .all<Record<string, unknown>>();
  return results ?? [];
}, { params: z.object({ id: z.string() }) });

cards.get("/", async ({ request, set, env }) => {
  const session = await getSession({ request, set, env });
  if (!ensureAuth(set, session)) return unauthorized();
  const { results } = await env.DB.prepare(
    "SELECT * FROM cards WHERE status = 'pending' ORDER BY score DESC LIMIT 100"
  ).all<Record<string, unknown>>();
  return (results ?? []).map(rowToCard);
});

cards.get("/queue", async ({ request, set, env }) => {
  const session = await getSession({ request, set, env });
  if (!ensureAuth(set, session)) return unauthorized();
  const { results } = await env.DB.prepare(
    "SELECT * FROM cards WHERE status IN ('pending', 'approved', 'rejected') ORDER BY updated_at DESC LIMIT 20"
  ).all<Record<string, unknown>>();
  return (results ?? []).map(rowToCard);
});

cards.get("/nudges", async ({ request, set, env }) => {
  const session = await getSession({ request, set, env });
  if (!ensureAuth(set, session)) return unauthorized();
  const { results } = await env.DB.prepare(
    "SELECT * FROM cards WHERE status = 'pending' ORDER BY score DESC LIMIT 20"
  ).all<Record<string, unknown>>();
  return (results ?? []).map(rowToCard);
});

cards.post("/:id/swipe", async ({ request, set, env, params, body }) => {
  const session = await getSession({ request, set, env });
  if (!ensureAuth(set, session)) return unauthorized();
  const id = params.id;

  const card = await fetchCardById(env.DB, id);
  if (!card) {
    set.status = 404;
    return notFound();
  }

  await updateLearningWeights(env.DB, card, body.direction);

  const swipeId = generateId();
  await env.DB.prepare("INSERT INTO swipes (id, card_id, user_id, direction, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(swipeId, id, session.id, body.direction, now())
    .run();

  const status = await resolveApprovalStatus(env.DB, card);
  if (status !== card.status) {
    await env.DB.prepare("UPDATE cards SET status = ?, updated_at = ? WHERE id = ?")
      .bind(status, now(), id)
      .run();
  }

  await notifyCardStatus(env, { ...card, status }, body.direction === "approve" ? "approved" : "rejected");

  return { ok: true, status };
}, { params: z.object({ id: z.string() }), body: z.object({ direction: directionSchema }) });

cards.post("/:id/ship", async ({ request, set, env, params }) => {
  const session = await getSession({ request, set, env });
  if (!ensureAuth(set, session)) return unauthorized();
  const id = params.id;
  const card = await fetchCardById(env.DB, id);
  if (!card) {
    set.status = 404;
    return notFound();
  }

  const ctx = createContext(env);
  const result = await onApprove(ctx, card);
  await updateLearningWeights(env.DB, card, "approve");
  await notifyCardStatus(env, { ...card, status: "shipped" }, "shipped");
  return result;
}, { params: z.object({ id: z.string() }) });

cards.post("/:id/reject", async ({ request, set, env, params }) => {
  const session = await getSession({ request, set, env });
  if (!ensureAuth(set, session)) return unauthorized();
  const id = params.id;
  const card = await fetchCardById(env.DB, id);
  if (!card) {
    set.status = 404;
    return notFound();
  }

  const ctx = createContext(env);
  const result = await onReject(ctx, card);
  await updateLearningWeights(env.DB, card, "reject");
  await notifyCardStatus(env, { ...card, status: "rejected" }, "rejected");
  return result;
}, { params: z.object({ id: z.string() }) });

cards.post("/:id/status", async ({ request, set, env, params, body }) => {
  const session = await getSession({ request, set, env });
  if (!ensureAuth(set, session)) return unauthorized();
  const id = params.id;

  if (body.status === "approved" || body.status === "rejected") {
    const card = await fetchCardById(env.DB, id);
    if (card) {
      const direction = body.status === "approved" ? "approve" : "reject";
      await updateLearningWeights(env.DB, card, direction);
    }
  }

  await env.DB.prepare("UPDATE cards SET status = ?, updated_at = ? WHERE id = ?")
    .bind(body.status, now(), id)
    .run();

  const updated = await fetchCardById(env.DB, id);
  if (updated) {
    await notifyCardStatus(env, updated, body.status as "created" | "approved" | "rejected" | "shipped");
  }

  return { ok: true };
}, { params: z.object({ id: z.string() }), body: z.object({ status: statusSchema }) });

function parseAutoApproveThreshold(env: Env): number {
  const raw = env.AUTO_APPROVE_THRESHOLD;
  if (!raw) return 8.5;
  const value = Number(raw);
  return Number.isFinite(value) ? value : 8.5;
}

function parseAutoApproveRisk(env: Env): Set<string> {
  const raw = env.AUTO_APPROVE_RISK;
  const defaults = new Set(["low"]);
  if (!raw) return defaults;
  const values = raw.split(",").map((r) => r.trim());
  return new Set(values.length > 0 ? values : ["low"]);
}

function shouldAutoApprove(env: Env, card: ShipCard): boolean {
  const threshold = parseAutoApproveThreshold(env);
  const allowedRisks = parseAutoApproveRisk(env);
  return card.score >= threshold && allowedRisks.has(card.risk);
}

export async function insertCard(
  env: Env,
  card: Omit<ShipCard, "id" | "score" | "createdAt" | "updatedAt" | "evidenceIds">
): Promise<ShipCard> {
  const id = generateId();
  const score = await autoScore(env.DB, card.repoFullName, {
    kind: card.kind,
    impact: card.impact,
    risk: card.risk,
    effect: card.effect,
    phase: card.phase,
  });
  const evidenceIds: string[] = [];
  const inserted: ShipCard = { ...card, id, score, evidenceIds, createdAt: now(), updatedAt: now() };

  if (shouldAutoApprove(env, inserted)) {
    inserted.status = "approved";
    await updateLearningWeights(env.DB, inserted, "approve");
  }

  await notifyCardStatus(env, inserted, inserted.status === "approved" ? "approved" : "created");

  await env.DB
    .prepare(
      `INSERT INTO cards (id, kind, title, description, status, repo_full_name, issue_number, pull_number, impact, risk, effect, phase, score, evidence_ids, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      card.kind,
      card.title,
      card.description,
      inserted.status,
      card.repoFullName,
      card.issueNumber ?? null,
      card.pullNumber ?? null,
      card.impact,
      card.risk,
      card.effect,
      card.phase,
      score,
      JSON.stringify(evidenceIds),
      now(),
      now()
    )
    .run();
  return inserted;
}

cards.post("/webhook", async ({ request, set, env, body }) => {
  const token = request.headers.get("x-bot-token");
  if (!env.BOT_TOKEN || token !== env.BOT_TOKEN) {
    set.status = 401;
    return { error: "unauthorized" };
  }

  const card = await insertCard(env, {
    kind: body.kind,
    title: body.title,
    description: body.description,
    status: "pending",
    repoFullName: body.repoFullName,
    issueNumber: body.issueNumber,
    pullNumber: body.pullNumber,
    impact: body.impact,
    risk: body.risk,
    effect: body.effect,
    phase: body.phase,
  });

  return { ok: true, card };
}, { body: cardInputSchema });

cards.post("/", async ({ request, set, env, body }) => {
  const session = await getSession({ request, set, env });
  if (!ensureAuth(set, session)) return unauthorized();
  const card = await insertCard(env, {
    kind: body.kind,
    title: body.title,
    description: body.description,
    status: "pending",
    repoFullName: body.repoFullName,
    issueNumber: body.issueNumber,
    pullNumber: body.pullNumber,
    impact: body.impact,
    risk: body.risk,
    effect: body.effect,
    phase: body.phase,
  });
  return { ok: true, card };
}, { body: cardInputSchema });

export default cards;
