import type { ShipCard, Env } from "@ship-feed/shared";
import { shipToGitHub } from "./lib/github";

export interface OrchestratorContext {
  db: D1Database;
  apiUrl: string;
  githubAppId: string;
  githubAppPrivateKey: string;
}

export function createContext(env: Env): OrchestratorContext {
  return {
    db: env.DB,
    apiUrl: env.PUBLIC_APP_URL,
    githubAppId: env.GITHUB_APP_ID,
    githubAppPrivateKey: env.GITHUB_APP_PRIVATE_KEY,
  };
}

function now() {
  return new Date().toISOString();
}

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

export async function fetchPendingCards(ctx: OrchestratorContext): Promise<ShipCard[]> {
  const { results } = await ctx.db
    .prepare("SELECT * FROM cards WHERE status = 'pending' ORDER BY score DESC LIMIT 100")
    .all<Record<string, unknown>>();
  return (results ?? []).map(rowToCard);
}

export async function fetchApprovedCards(ctx: OrchestratorContext): Promise<ShipCard[]> {
  const { results } = await ctx.db
    .prepare("SELECT * FROM cards WHERE status = 'approved' ORDER BY score DESC LIMIT 100")
    .all<Record<string, unknown>>();
  return (results ?? []).map(rowToCard);
}

async function updateCardStatus(ctx: OrchestratorContext, card: ShipCard, status: ShipCard["status"]) {
  await ctx.db
    .prepare("UPDATE cards SET status = ?, updated_at = ? WHERE id = ?")
    .bind(status, now(), card.id)
    .run();
}

export async function onApprove(ctx: OrchestratorContext, card: ShipCard) {
  await updateCardStatus(ctx, card, "shipped");
  const gh = await shipToGitHub({
    appId: ctx.githubAppId,
    privateKey: ctx.githubAppPrivateKey,
    repoFullName: card.repoFullName,
    issueNumber: card.issueNumber,
    pullNumber: card.pullNumber,
    action: "approve",
  });
  if (gh.skipped) {
    console.log(`[ship-feed] shipped ${card.id} (GitHub: ${gh.message})`);
  } else if (!gh.ok) {
    console.error(`[ship-feed] shipped ${card.id} (GitHub action failed: ${gh.message})`);
  } else {
    console.log(`[ship-feed] shipped ${card.id}`);
  }
  return { ok: true, card: { ...card, status: "shipped" as const }, github: gh };
}

export async function onReject(ctx: OrchestratorContext, card: ShipCard) {
  await updateCardStatus(ctx, card, "rejected");
  const gh = await shipToGitHub({
    appId: ctx.githubAppId,
    privateKey: ctx.githubAppPrivateKey,
    repoFullName: card.repoFullName,
    issueNumber: card.issueNumber,
    pullNumber: card.pullNumber,
    action: "reject",
  });
  if (gh.skipped) {
    console.log(`[ship-feed] rejected ${card.id} (GitHub: ${gh.message})`);
  } else if (!gh.ok) {
    console.error(`[ship-feed] rejected ${card.id} (GitHub action failed: ${gh.message})`);
  } else {
    console.log(`[ship-feed] rejected ${card.id}`);
  }
  return { ok: true, card: { ...card, status: "rejected" as const }, github: gh };
}

export async function runShipLoop(ctx: OrchestratorContext) {
  const cards = await fetchApprovedCards(ctx);
  for (const card of cards) {
    await onApprove(ctx, card);
  }
  return { shipped: cards.length };
}
