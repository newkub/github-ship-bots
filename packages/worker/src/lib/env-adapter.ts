import type { Env } from "@ship-feed/shared";

export interface BotEnv extends Env {
  APP_ID: string;
  PRIVATE_KEY: string;
  WEBHOOK_SECRET: string;
  API_TOKEN: string;
  API_URL: string;
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

function requireString(env: Env, key: keyof Env): string {
  const value = env[key];
  if (typeof value !== "string" || value === "") {
    throw new Error(`Missing or invalid ${String(key)}`);
  }
  return value;
}

export function toBotEnv(env: Env): BotEnv {
  const appId = requireString(env, "GITHUB_APP_ID");
  const privateKey = requireString(env, "GITHUB_APP_PRIVATE_KEY");
  const webhookSecret = requireString(env, "GITHUB_WEBHOOK_SECRET");
  const botToken = requireString(env, "BOT_TOKEN");
  const publicAppUrl = requireString(env, "PUBLIC_APP_URL");

  if (!env.ASSETS) {
    throw new Error("Missing ASSETS binding");
  }

  return {
    ...env,
    APP_ID: appId,
    PRIVATE_KEY: privateKey,
    WEBHOOK_SECRET: webhookSecret,
    API_TOKEN: botToken,
    API_URL: publicAppUrl,
    OPENAI_API_KEY: env.OPENAI_API_KEY,
    ASSETS: env.ASSETS,
  };
}
