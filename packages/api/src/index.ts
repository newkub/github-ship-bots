import { Elysia } from "elysia";
import type { Env } from "@ship-feed/shared";
import { setRequestEnv } from "./lib/env";
import { corsHeaders, applyCors } from "./lib/cors";
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

function createRequest(input: string | Request, init?: RequestInit): Request {
  if (input instanceof Request) return input;
  return new Request(new URL(input, "http://localhost").toString(), init);
}

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext
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
  async request(input: string | Request, init: RequestInit | undefined, env: Env): Promise<Response> {
    const request = createRequest(input, init);
    return this.fetch(request, env, undefined as unknown as ExecutionContext);
  },
};
