import { AsyncLocalStorage } from "node:async_hooks";
import type { BotEnv } from "../types";
const botEnvStore = new AsyncLocalStorage<BotEnv>();
export function runWithBotEnv<T>(env: BotEnv, callback: () => Promise<T> | T): Promise<T> {
  return botEnvStore.run(env, callback) as Promise<T>;
}
export function getBotEnv(): BotEnv {
  const env = botEnvStore.getStore();
  if (!env) throw new Error("Bot environment not set");
  return env;
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
  const url = env.API_URL;
  if (!url) throw new Error("Missing API_URL");
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
    creatorLogin?: string;
  }
) {
  const env = getBotEnv();
  const url = env.API_URL;
  if (!url) throw new Error("Missing API_URL");
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
