import type { Env } from "@ship-feed/shared";

export interface BotEnv extends Env {
  APP_ID: string;
  PRIVATE_KEY: string;
  WEBHOOK_SECRET: string;
  API_TOKEN: string;
  API_URL: string;
  OPENAI_REVIEW_MODE?: "auto" | "heuristic" | "required";
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

function checkString(env: Env, key: keyof Env): string | undefined {
  const value = env[key];
  if (typeof value !== "string" || value === "") {
    return undefined;
  }
  return value;
}

export type BotEnvResult =
  | { ok: true; env: BotEnv }
  | { ok: false; missing: string[] };

export function toBotEnv(env: Env): BotEnvResult {
  const missing: string[] = [];
  const appId = checkString(env, "GITHUB_APP_ID");
  const privateKey = checkString(env, "GITHUB_APP_PRIVATE_KEY");
  const webhookSecret = checkString(env, "GITHUB_WEBHOOK_SECRET");
  const botToken = checkString(env, "BOT_TOKEN");
  const publicAppUrl = checkString(env, "PUBLIC_APP_URL");

  if (!appId) missing.push("GITHUB_APP_ID");
  if (!privateKey) missing.push("GITHUB_APP_PRIVATE_KEY");
  if (!webhookSecret) missing.push("GITHUB_WEBHOOK_SECRET");
  if (!botToken) missing.push("BOT_TOKEN");
  if (!publicAppUrl) missing.push("PUBLIC_APP_URL");
  if (!env.ASSETS) missing.push("ASSETS");

  if (missing.length > 0) return { ok: false, missing };

  return {
    ok: true,
    env: {
      ...env,
      APP_ID: appId!,
      PRIVATE_KEY: privateKey!,
      WEBHOOK_SECRET: webhookSecret!,
      API_TOKEN: botToken!,
      API_URL: publicAppUrl!,
      OPENAI_API_KEY: env.OPENAI_API_KEY,
      OPENAI_REVIEW_MODE: (env.OPENAI_REVIEW_MODE as "auto" | "heuristic" | "required" | undefined) ?? "auto",
      ASSETS: env.ASSETS,
    } as BotEnv,
  };
}
