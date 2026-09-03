import apiApp from "@ship-feed/api";
import botWorker from "@ship-feed/bot/worker";
import orchestratorWorker from "@ship-feed/orchestrator/worker";
import { timingSafeEquals } from "@ship-feed/shared";
import { toBotEnv } from "./lib/env-adapter";
import type { Env } from "@ship-feed/shared";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/webhook") {
      return botWorker.fetch(request, toBotEnv(env));
    }

    if (url.pathname === "/dashboard") {
      return new Response(null, { status: 301, headers: { Location: "/dashboard/" } });
    }

    if (url.pathname === "/orchestrate" || url.pathname === "/ship") {
      const cronSecret = env.CRON_SECRET;
      const provided = request.headers.get("x-cron-secret") ?? "";
      if (!cronSecret || cronSecret.length < 32 || !timingSafeEquals(provided, cronSecret)) {
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
      if (!url.pathname.includes(".") && !url.pathname.startsWith("/api/") && !url.pathname.startsWith("/auth/")) {
        const indexUrl = new URL("/index.html", url);
        return env.ASSETS.fetch(new Request(indexUrl.toString(), request));
      }
      return env.ASSETS.fetch(request);
    }
    return apiRes;
  },
};
