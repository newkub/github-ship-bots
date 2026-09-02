import apiApp from "@ship-feed/api";
import botWorker from "@ship-feed/bot/worker";
import orchestratorWorker from "@ship-feed/orchestrator/worker";
import type { Env } from "@ship-feed/shared";

interface BotEnv extends Env {
  APP_ID: string;
  PRIVATE_KEY: string;
  WEBHOOK_SECRET: string;
  API_TOKEN: string;
  API_URL: string;
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/webhook") {
      const botEnv: BotEnv = {
        ...env,
        APP_ID: env.GITHUB_APP_ID,
        PRIVATE_KEY: env.GITHUB_APP_PRIVATE_KEY,
        WEBHOOK_SECRET: env.GITHUB_WEBHOOK_SECRET,
        API_TOKEN: env.BOT_TOKEN ?? "",
        API_URL: env.PUBLIC_APP_URL,
        ASSETS: env.ASSETS ?? { fetch: async () => new Response("not found", { status: 404 }) },
      };
      return botWorker.fetch(request, botEnv);
    }

    if (url.pathname === "/orchestrate" || url.pathname === "/ship") {
      return orchestratorWorker.fetch(request, env);
    }

    if (request.method === "GET" && url.pathname === "/") {
      if (env.ASSETS) {
        const asset = await env.ASSETS.fetch(request);
        if (asset.status !== 404) return asset;
      }
    }

    const apiRes = await apiApp.fetch(request, env, ctx);
    if (apiRes.status === 404 && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return apiRes;
  },

  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    await orchestratorWorker.scheduled(controller, env, ctx);
  },
};
