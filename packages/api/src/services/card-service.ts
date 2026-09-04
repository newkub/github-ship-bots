import type { Env, ShipCard } from "@ship-feed/shared";
import { generateId, now } from "@ship-feed/shared";
import { autoScore } from "../lib/score";
import { updateLearningWeights } from "../lib/learning";
import { notifyCardStatus } from "../lib/notify";
import { rowToCard } from "../lib/card-mapper";
import { shouldAutoApprove } from "../lib/card-auto-approve";

export async function fetchCardById(db: Env["DB"], id: string): Promise<ShipCard | undefined> {
  const row = await db.prepare("SELECT * FROM cards WHERE id = ?").bind(id).first<Record<string, unknown>>();
  if (!row) return undefined;
  return rowToCard(row);
}

export async function requireCard(db: Env["DB"], id: string, userId: string): Promise<ShipCard | undefined> {
  const card = await fetchCardById(db, id);
  if (!card) return undefined;
  if (!(await canAccessCard(db, card, userId))) return undefined;
  return card;
}

export async function canAccessCard(db: Env["DB"], card: ShipCard, userId: string): Promise<boolean> {
  if (card.creatorId === userId) return true;
  return canAccessRepo(db, userId, card.repoFullName);
}

export async function canAccessRepo(db: Env["DB"], userId: string, repoFullName: string): Promise<boolean> {
  const row = await db
    .prepare("SELECT 1 FROM user_repos WHERE user_id = ? AND repo_full_name = ?")
    .bind(userId, repoFullName)
    .first();
  return Boolean(row);
}

export async function insertCard(
  env: Env,
  card: Omit<ShipCard, "id" | "score" | "createdAt" | "updatedAt" | "evidenceIds">,
  creatorId?: string
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
  const inserted: ShipCard = { ...card, id, creatorId, score, evidenceIds, createdAt: now(), updatedAt: now() };
  if (shouldAutoApprove(env, inserted)) {
    inserted.status = "approved";
    await updateLearningWeights(env.DB, inserted, "approve");
  }
  await notifyCardStatus(env, inserted, inserted.status === "approved" ? "approved" : "created");
  await env.DB
    .prepare(
      `INSERT INTO cards (id, creator_id, kind, title, description, status, repo_full_name, issue_number, pull_number, impact, risk, effect, phase, score, evidence_ids, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      id,
      creatorId ?? null,
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
