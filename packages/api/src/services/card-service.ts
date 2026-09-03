import type { Env, ShipCard } from "@ship-feed/shared";
import { generateId, now } from "../lib/db";
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
