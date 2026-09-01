import { Hono } from "hono";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import { updateLearningWeights } from "../lib/learning";
import { autoScore } from "../lib/score";
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

async function ensureDemoCard(db: Env["DB"]) {
  const existing = await db.prepare("SELECT id FROM cards LIMIT 1").first();
  if (existing) return;
  const id = generateId();
  await db.prepare(
    `INSERT INTO cards (id, kind, title, description, status, repo_full_name, issue_number, pull_number, impact, risk, effect, phase, score, evidence_ids, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      "idea",
      "Add mobile PWA swipe cards",
      "Build a TikTok-like mobile interface for approving and rejecting ship-feed cards.",
      "pending",
      "newkub/github-ship-bots",
      1,
      null,
      "high",
      "medium",
      "high",
      "mvp",
      10,
      "[]",
      now(),
      now()
    )
    .run();
}

cards.get("/", async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: "unauthorized" }, 401);
  await ensureDemoCard(c.env.DB);
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM cards WHERE status = 'pending' ORDER BY score DESC LIMIT 100"
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

  const status = body.direction === "approve" ? "approved" : "rejected";
  await c.env.DB.prepare("UPDATE cards SET status = ?, updated_at = ? WHERE id = ?")
    .bind(status, now(), id)
    .run();

  await updateLearningWeights(c.env.DB, card, body.direction);

  const swipeId = generateId();
  await c.env.DB.prepare("INSERT INTO swipes (id, card_id, user_id, direction, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(swipeId, id, session.id, body.direction, now())
    .run();

  return c.json({ ok: true, status });
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
  return c.json({ ok: true });
});

async function insertCard(
  db: Env["DB"],
  card: Omit<ShipCard, "id" | "score" | "createdAt" | "updatedAt" | "evidenceIds">
): Promise<ShipCard> {
  const id = generateId();
  const score = await autoScore(db, card.repoFullName, {
    kind: card.kind,
    impact: card.impact,
    risk: card.risk,
    effect: card.effect,
    phase: card.phase,
  });
  const evidenceIds: string[] = [];
  await db
    .prepare(
      `INSERT INTO cards (id, kind, title, description, status, repo_full_name, issue_number, pull_number, impact, risk, effect, phase, score, evidence_ids, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      card.kind,
      card.title,
      card.description,
      card.status,
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
  return { ...card, id, score, evidenceIds, createdAt: now(), updatedAt: now() };
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

  const card = await insertCard(c.env.DB, {
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
  const card = await insertCard(c.env.DB, {
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
