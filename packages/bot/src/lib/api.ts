import type { BotEnv } from "../types.ts";

let currentEnv: BotEnv | undefined;

export function setBotEnv(env: BotEnv) {
  currentEnv = env;
}

export function getBotEnv(): BotEnv {
  if (!currentEnv) throw new Error("Bot environment not set");
  return currentEnv;
}

export async function uploadEvidence(
  body: {
    cardId?: string;
    kind: string;
    data: string;
    ciRunUrl?: string;
  }
) {
  const env = getBotEnv();
  const url = env.API_URL ?? "https://github-ship-bots.newkubise.workers.dev";
  const res = await fetch(`${url}/api/evidence/webhook`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-bot-token": env.API_TOKEN ?? "",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to upload evidence: ${res.status} ${text}`);
  }
  return (await res.json()) as { id: string; key: string; hash: string };
}

export async function createCardFromWebhook(
  body: {
    kind: "idea" | "work" | "merge" | "release";
    title: string;
    description: string;
    repoFullName: string;
    issueNumber?: number;
    pullNumber?: number;
  }
) {
  const env = getBotEnv();
  const url = env.API_URL ?? "https://github-ship-bots.newkubise.workers.dev";
  const res = await fetch(`${url}/api/cards/webhook`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-bot-token": env.API_TOKEN ?? "",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create card: ${res.status} ${text}`);
  }
  return (await res.json()) as { ok: true; card: { id: string; score: number } };
}
