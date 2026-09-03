import type { Env } from "@ship-feed/shared";

export interface BotEnv extends Env {
  APP_ID: string;
  PRIVATE_KEY: string;
  WEBHOOK_SECRET: string;
  API_TOKEN: string;
  API_URL: string;
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

export function toBotEnv(env: Env): BotEnv {
  return {
    ...env,
    APP_ID: env.GITHUB_APP_ID,
    PRIVATE_KEY: env.GITHUB_APP_PRIVATE_KEY,
    WEBHOOK_SECRET: env.GITHUB_WEBHOOK_SECRET,
    API_TOKEN: env.BOT_TOKEN ?? "",
    API_URL: env.PUBLIC_APP_URL,
    OPENAI_API_KEY: env.OPENAI_API_KEY,
    ASSETS: env.ASSETS ?? { fetch: async () => new Response("not found", { status: 404 }) },
  };
}
