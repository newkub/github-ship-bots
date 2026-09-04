import { Elysia } from "elysia";
import { getRequestEnv } from "./lib/env";
import { validateRuntimeEnv } from "./lib/validate-env";
import { getCorrelationId, logError } from "@ship-feed/shared";
import auth from "./routes/auth";
import cards from "./routes/cards";
import repos from "./routes/repos";
import templates from "./routes/templates";
import evidence from "./routes/evidence";
import oracle from "./routes/oracle";
import inspector from "./routes/inspector";
import stripe from "./routes/stripe";
import learning from "./routes/learning";
import push from "./routes/push";
import releases from "./routes/releases";
import rules from "./routes/rules";
import config from "./routes/config";
import { createMiddleware } from "./middleware";

export function createApp(): Elysia<any, any, any, any, any, any, any> {
  return new Elysia()
    .use(createMiddleware())
    .onError(({ code, error, set, request }) => {
      const detail = error instanceof Error ? error.message : typeof error === "string" ? error : "Internal error";
      if (code === "VALIDATION") {
        set.status = 400;
        return { error: "validation error", message: detail };
      }
      if (code === "NOT_FOUND") {
        set.status = 404;
        return { error: "not found" };
      }
      const correlationId = getCorrelationId(request.headers);
      logError({ type: "unhandled_error", path: request.url, method: request.method, correlationId, detail });
      set.status = 500;
      return { error: "internal error" };
    })
    .get("/", () => "")
    .get("/health", () => ({ ok: true, service: "ship-feed-api" }))
    .get("/health/detailed", ({ request }) => {
      const env = getRequestEnv(request);
      const missing = env ? validateRuntimeEnv(env, "/") : ["DB"];
      return { ok: missing.length === 0, service: "ship-feed-api", missing };
    })
    .use(auth)
    .use(cards)
    .use(repos)
    .use(templates)
    .use(evidence)
    .use(oracle)
    .use(inspector)
    .use(stripe)
    .use(learning)
    .use(push)
    .use(releases)
    .use(rules)
    .use(config);
}
