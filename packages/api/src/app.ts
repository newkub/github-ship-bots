import { Elysia } from "elysia";
import { getRequestEnv } from "./lib/env";
import { validateRuntimeEnv } from "./lib/validate-env";
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
