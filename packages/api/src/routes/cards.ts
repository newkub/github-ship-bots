import { Hono } from "hono";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import { updateLearningWeights } from "../lib/learning";
import { autoScore, explainScore } from "../lib/score";
import { resolveApprovalStatus } from "../lib/approval";
import { notifyCardStatus } from "../lib/notify";
import { createContext, onApprove, onReject } from "@ship-feed/orchestrator";
import type { Env, ShipCard, SwipeEvent } from "@ship-feed/shared";

const cards = new Hono<{ Bindings: Env }>();

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

cards.get("/:id", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const id = c.req.param("id");
  const card = await fetchCardById(c.env.DB, id);
  if (!card) return c.json({ error: "card not found" }, 404);
  return c.json(card);
});

cards.get("/:id/explain", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const id = c.req.param("id");
  const card = await fetchCardById(c.env.DB, id);
  if (!card) return c.json({ error: "card not found" }, 404);

  const explanation = await explainScore(c.env.DB, card.repoFullName, {
    kind: card.kind,
    impact: card.impact,
    risk: card.risk,
    effect: card.effect,
    phase: card.phase,
  });

  return c.json(explanation);
});

cards.get("/:id/votes", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const id = c.req.param("id");
  const card = await fetchCardById(c.env.DB, id);
  if (!card) return c.json({ error: "card not found" }, 404);

  const rule = await c.env.DB
    .prepare("SELECT min_approvers, min_rejectors FROM approval_rules WHERE repo_full_name = ?")
    .bind(card.repoFullName)
    .first<{ min_approvers: number; min_rejectors: number }>();

  const { results } = await c.env.DB
    .prepare("SELECT s.direction, u.github_login as user FROM swipes s LEFT JOIN users u ON s.user_id = u.id WHERE s.card_id = ? ORDER BY s.created_at DESC")
    .bind(id)
    .all<{ direction: string; user: string }>();

  return c.json({
    minApprovers: rule?.min_approvers ?? 1,
    minRejectors: rule?.min_rejectors ?? 1,
    votes: results ?? [],
  });
});

cards.get("/:id/evidence", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const id = c.req.param("id");
  const card = await fetchCardById(c.env.DB, id);
  if (!card) return c.json({ error: "card not found" }, 404);
  const { results } = await c.env.DB.prepare("SELECT * FROM evidence WHERE card_id = ? ORDER BY created_at DESC")
    .bind(id)
    .all<Record<string, unknown>>();
  return c.json(results ?? []);
});

cards.get("/", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM cards WHERE status = 'pending' ORDER BY score DESC LIMIT 100"
  ).all<Record<string, unknown>>();
  return c.json(results.map(rowToCard));
});

cards.get("/queue", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM cards WHERE status IN ('pending', 'approved', 'rejected') ORDER BY updated_at DESC LIMIT 20"
  ).all<Record<string, unknown>>();
  return c.json(results.map(rowToCard));
});

cards.get("/nudges", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM cards WHERE status = 'pending' ORDER BY score DESC LIMIT 20"
  ).all<Record<string, unknown>>();
  return c.json(results.map(rowToCard));
});

cards.post("/:id/swipe", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<{ direction: SwipeEvent["direction"] }>();
  const id = c.req.param("id");

  const card = await fetchCardById(c.env.DB, id);
  if (!card) return c.json({ error: "card not found" }, 404);

  await updateLearningWeights(c.env.DB, card, body.direction);

  const swipeId = generateId();
  await c.env.DB.prepare("INSERT INTO swipes (id, card_id, user_id, direction, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(swipeId, id, session.id, body.direction, now())
    .run();

  const status = await resolveApprovalStatus(c.env.DB, card);
  if (status !== card.status) {
    await c.env.DB.prepare("UPDATE cards SET status = ?, updated_at = ? WHERE id = ?")
      .bind(status, now(), id)
      .run();
  }

  await notifyCardStatus(c.env, { ...card, status }, body.direction === "approve" ? "approved" : "rejected");

  return c.json({ ok: true, status });
});

cards.post("/:id/ship", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const id = c.req.param("id");
  const card = await fetchCardById(c.env.DB, id);
  if (!card) return c.json({ error: "card not found" }, 404);

  const ctx = createContext(c.env);
  const result = await onApprove(ctx, card);
  await updateLearningWeights(c.env.DB, card, "approve");
  await notifyCardStatus(c.env, { ...card, status: "shipped" }, "shipped");
  return c.json(result);
});

cards.post("/:id/reject", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const id = c.req.param("id");
  const card = await fetchCardById(c.env.DB, id);
  if (!card) return c.json({ error: "card not found" }, 404);

  const ctx = createContext(c.env);
  const result = await onReject(ctx, card);
  await updateLearningWeights(c.env.DB, card, "reject");
  await notifyCardStatus(c.env, { ...card, status: "rejected" }, "rejected");
  return c.json(result);
});

cards.post("/:id/status", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<{ status: ShipCard["status"] }>();
  const id = c.req.param("id");

  if (body.status === "approved" || body.status === "rejected") {
    const card = await fetchCardById(c.env.DB, id);
    if (card) {
      const direction = body.status === "approved" ? "approve" : "reject";
      await updateLearningWeights(c.env.DB, card, direction);
    }
  }

  await c.env.DB.prepare("UPDATE cards SET status = ?, updated_at = ? WHERE id = ?")
    .bind(body.status, now(), id)
    .run();

  const updated = await fetchCardById(c.env.DB, id);
  if (updated) {
    await notifyCardStatus(c.env, updated, body.status as "created" | "approved" | "rejected" | "shipped");
  }

  return c.json({ ok: true });
});

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

cards.post("/webhook", async (c) => {
  const token = c.req.header("x-bot-token");
  if (!c.env.BOT_TOKEN || token !== c.env.BOT_TOKEN) {
    return c.json({ error: "unauthorized" }, 401);
  }
  const body = await c.req.json<{
    kind: ShipCard["kind"];
    title: string;
    description: string;
    repoFullName: string;
    issueNumber?: number;
    pullNumber?: number;
    impact?: ShipCard["impact"];
    risk?: ShipCard["risk"];
    effect?: ShipCard["effect"];
    phase?: ShipCard["phase"];
  }>();

  const card = await insertCard(c.env, {
    kind: body.kind,
    title: body.title,
    description: body.description,
    status: "pending",
    repoFullName: body.repoFullName,
    issueNumber: body.issueNumber,
    pullNumber: body.pullNumber,
    impact: body.impact ?? "medium",
    risk: body.risk ?? "medium",
    effect: body.effect ?? "medium",
    phase: body.phase ?? "mvp",
  });

  return c.json({ ok: true, card });
});

cards.post("/", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  const body = await c.req.json<{
    kind: ShipCard["kind"];
    title: string;
    description: string;
    repoFullName: string;
    issueNumber?: number;
    pullNumber?: number;
    impact?: ShipCard["impact"];
    risk?: ShipCard["risk"];
    effect?: ShipCard["effect"];
    phase?: ShipCard["phase"];
  }>();
  const card = await insertCard(c.env, {
    kind: body.kind,
    title: body.title,
    description: body.description,
    status: "pending",
    repoFullName: body.repoFullName,
    issueNumber: body.issueNumber,
    pullNumber: body.pullNumber,
    impact: body.impact ?? "medium",
    risk: body.risk ?? "medium",
    effect: body.effect ?? "medium",
    phase: body.phase ?? "mvp",
  });
  return c.json({ ok: true, card });
});

export default cards;
