import { Elysia } from "elysia";
import { setRequestEnv, getRequestEnv } from "./lib/env";
import { corsHeaders, applyCors } from "./lib/cors";
import { checkRateLimit } from "./lib/rate-limit";
import { validateRuntimeEnv } from "./lib/validate-env";
import type { Env } from "@ship-feed/shared";

export function createMiddleware() {
  return new Elysia()
    .onBeforeHandle(async ({ request, set }) => {
      const url = new URL(request.url);
      if (url.pathname === "/" || url.pathname === "/health") return;

      const env = getRequestEnv(request);
      if (!env?.DB) {
        set.status = 503;
        return { error: "service unavailable", missing: ["DB"] };
      }

      const missing = validateRuntimeEnv(env, url.pathname);
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
    });
}

export async function handleRequest(
  app: Elysia<any, any, any, any, any, any, any>,
  request: Request,
  env: Env
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
}
