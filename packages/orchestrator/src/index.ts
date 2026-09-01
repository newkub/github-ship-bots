import type { ShipCard, Env } from "@ship-feed/shared";

const API_URL = process.env.PUBLIC_APP_URL || "https://github-ship-bots.newkubise.workers.dev";

export interface OrchestratorContext {
  apiUrl: string;
  githubAppId: string;
  githubAppPrivateKey: string;
}

export function createContext(env: Env): OrchestratorContext {
  return {
    apiUrl: env.PUBLIC_APP_URL,
    githubAppId: env.GITHUB_APP_ID,
    githubAppPrivateKey: env.GITHUB_APP_PRIVATE_KEY,
  };
}

export async function fetchPendingCards(ctx: OrchestratorContext): Promise<ShipCard[]> {
  const res = await fetch(`${ctx.apiUrl}/api/cards`);
  if (!res.ok) throw new Error("Failed to fetch cards");
  return (await res.json()) as ShipCard[];
}

export async function onApprove(ctx: OrchestratorContext, card: ShipCard) {
  console.log(`[ship-feed] approve ${card.id}`);
  // TODO: call Devin `continue` / `ship` to implement, test, and deploy
  return { ok: true, card };
}

export async function onReject(ctx: OrchestratorContext, card: ShipCard) {
  console.log(`[ship-feed] reject ${card.id}`);
  // TODO: close issue/PR and update learning weights
  return { ok: true, card };
}
