import { now } from "./db";
import type { D1Database } from "@cloudflare/workers-types";
import type { ShipCard } from "@ship-feed/shared";

export interface ApprovalRule {
  repoFullName: string;
  minApprovers: number;
  minRejectors: number;
  updatedAt: string;
}

export async function getApprovalRule(db: D1Database, repoFullName: string): Promise<ApprovalRule> {
  const row = await db
    .prepare("SELECT * FROM approval_rules WHERE repo_full_name = ?")
    .bind(repoFullName)
    .first<{ repo_full_name: string; min_approvers: number; min_rejectors: number; updated_at: string }>();
  if (row) {
    return {
      repoFullName: row.repo_full_name,
      minApprovers: row.min_approvers,
      minRejectors: row.min_rejectors,
      updatedAt: row.updated_at,
    };
  }
  return {
    repoFullName,
    minApprovers: 1,
    minRejectors: 1,
    updatedAt: now(),
  };
}

export async function setApprovalRule(
  db: D1Database,
  rule: ApprovalRule
): Promise<void> {
  await db
    .prepare(
      "INSERT OR REPLACE INTO approval_rules (repo_full_name, min_approvers, min_rejectors, updated_at) VALUES (?, ?, ?, ?)"
    )
    .bind(rule.repoFullName, rule.minApprovers, rule.minRejectors, rule.updatedAt)
    .run();
}

export async function countVotes(db: D1Database, cardId: string): Promise<{ approve: number; reject: number }> {
  const { results } = await db
    .prepare("SELECT direction FROM swipes WHERE card_id = ?")
    .bind(cardId)
    .all<{ direction: string }>();
  const approve = (results ?? []).filter((r) => r.direction === "approve").length;
  const reject = (results ?? []).filter((r) => r.direction === "reject").length;
  return { approve, reject };
}

export async function resolveApprovalStatus(
  db: D1Database,
  card: ShipCard
): Promise<"approved" | "rejected" | "pending"> {
  const rule = await getApprovalRule(db, card.repoFullName);
  const votes = await countVotes(db, card.id);
  if (votes.approve >= rule.minApprovers) return "approved";
  if (votes.reject >= rule.minRejectors) return "rejected";
  return "pending";
}
