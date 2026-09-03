import { AsyncLocalStorage } from "node:async_hooks";
import { assertRecord, assertString, assertNumber, assertBoolean } from "@ship-feed/shared";
import type { BotEnv } from "../types";
const botEnvStore = new AsyncLocalStorage<BotEnv>();
export function runWithBotEnv<T>(env: BotEnv, callback: () => Promise<T> | T): Promise<T> {
  return Promise.resolve(botEnvStore.run(env, callback));
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
      "x-bot-token": env.API_TOKEN,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to upload evidence: ${res.status} ${text}`);
  }
  const data = await res.json();
  const record = assertRecord(data, "evidence");
  return {
    id: assertString(record.id, "id"),
    key: assertString(record.key, "key"),
    hash: assertString(record.hash, "hash"),
  };
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
      "x-bot-token": env.API_TOKEN,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create card: ${res.status} ${text}`);
  }
  const data = await res.json();
  const record = assertRecord(data, "card response");
  assertBoolean(record.ok, "ok");
  const card = assertRecord(record.card, "card");
  return {
    ok: record.ok,
    card: {
      id: assertString(card.id, "card.id"),
      score: assertNumber(card.score, "card.score"),
    },
  };
}
