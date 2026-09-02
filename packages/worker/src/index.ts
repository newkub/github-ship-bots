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

    if (url.pathname === "/dashboard") {
      return new Response(null, { status: 301, headers: { Location: "/dashboard/" } });
    }

    if (url.pathname === "/orchestrate" || url.pathname === "/ship") {
      const cronSecret = env.CRON_SECRET ?? "";
      const provided = request.headers.get("x-cron-secret") ?? "";
      if (!cronSecret || provided !== cronSecret) {
        return new Response("unauthorized", { status: 401 });
      }
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
      if (url.pathname.startsWith("/dashboard/") && !url.pathname.includes(".")) {
        const indexUrl = new URL("/dashboard/index.html", url);
        return env.ASSETS.fetch(new Request(indexUrl.toString(), request));
      }
      return env.ASSETS.fetch(request);
    }
    return apiRes;
  },
};
