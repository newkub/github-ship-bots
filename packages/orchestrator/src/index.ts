import type { ShipCard, Env } from "@ship-feed/shared";
import { rowToCard } from "@ship-feed/shared";
import { shipToGitHub } from "./lib/github";

import { getCorrelationId } from "@ship-feed/shared";

export interface OrchestratorContext {
  db: D1Database;
  apiUrl: string;
  githubApiUrl: string;
  githubWebUrl: string;
  correlationId: string;
  githubAppId: string;
  githubAppPrivateKey: string;
}

export function createContext(env: Env): OrchestratorContext {
  return {
    db: env.DB,
    apiUrl: env.PUBLIC_APP_URL,
    githubApiUrl: env.GITHUB_API_URL || "https://api.github.com",
    githubWebUrl: env.GITHUB_WEB_URL || "https://github.com",
    correlationId: getCorrelationId(),
    githubAppId: env.GITHUB_APP_ID,
    githubAppPrivateKey: env.GITHUB_APP_PRIVATE_KEY,
  };
}

function now() {
  return new Date().toISOString();
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
    githubApiUrl: ctx.githubApiUrl,
    githubWebUrl: ctx.githubWebUrl,
    correlationId: ctx.correlationId,
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
    githubApiUrl: ctx.githubApiUrl,
    githubWebUrl: ctx.githubWebUrl,
    correlationId: ctx.correlationId,
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
