import { Elysia } from "elysia";
import type { Env } from "@ship-feed/shared";
import { setRequestEnv, getRequestEnv } from "./lib/env";
import { corsHeaders, applyCors } from "./lib/cors";
import { checkRateLimit } from "./lib/rate-limit";
import { validateRuntimeEnv } from "./lib/validate-env";
import auth from "./routes/auth";
import cards from "./routes/cards";
import repos from "./routes/repos";
import plugins from "./routes/plugins";
import templates from "./routes/templates";
import evidence from "./routes/evidence";
import oracle from "./routes/oracle";
import inspector from "./routes/inspector";
import stripe from "./routes/stripe";
import learning from "./routes/learning";
import push from "./routes/push";

const app = new Elysia()
  .onBeforeHandle(async ({ request, set }) => {
    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "/health") return;

    const env = getRequestEnv(request);
    if (!env?.DB) return;

    const missing = validateRuntimeEnv(env);
    if (missing.length > 0) {
      set.status = 503;
      return { error: "service unavailable", missing };
    }

    const limit = url.pathname.startsWith("/auth") ? 30 : 100;
    const rate = await checkRateLimit(env, request, limit);
    if (!rate.allowed) {
      set.status = 429;
      set.headers["retry-after"] = String(rate.retryAfter);
      return { error: "rate limit exceeded", retryAfter: rate.retryAfter };
    }
  })
  .get("/", () => "")
  .get("/health", () => ({ ok: true, service: "ship-feed-api" }))
  .use(auth)
  .use(cards)
  .use(repos)
  .use(plugins)
  .use(templates)
  .use(evidence)
  .use(oracle)
  .use(inspector)
  .use(stripe)
  .use(learning)
  .use(push);

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx?: ExecutionContext
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request, env),
      });
    }

    setRequestEnv(request, env);
    const response = await app.fetch(request);
    return applyCors(response, request, env);
  },
};
