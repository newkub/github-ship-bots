import { Hono } from "hono";
import { getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
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

  const status = body.direction === "approve" ? "approved" : "rejected";
  await c.env.DB.prepare("UPDATE cards SET status = ?, updated_at = ? WHERE id = ?")
    .bind(status, now(), id)
    .run();

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
  await c.env.DB.prepare("UPDATE cards SET status = ?, updated_at = ? WHERE id = ?")
    .bind(body.status, now(), id)
    .run();
  return c.json({ ok: true });
});

export default cards;
