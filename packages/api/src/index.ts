import { Elysia } from "elysia";
import type { Env } from "@ship-feed/shared";
import { setRequestEnv } from "./lib/env";
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

const ALLOWED_ORIGINS = [
  "https://github-ship-bots.newkubise.workers.dev",
  "http://localhost:5173",
  "http://localhost:5174",
];

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

function matchedOrigin(request: Request): string | undefined {
  const origin = request.headers.get("origin");
  if (!origin) return undefined;
  return ALLOWED_ORIGINS.includes(origin) ? origin : undefined;
}

function corsHeaders(request: Request): Record<string, string> {
  const origin = matchedOrigin(request);
  const requested = request.headers.get("access-control-request-headers");
  const headers: Record<string, string> = {
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "access-control-allow-headers": requested ?? "*",
    vary: "Origin",
  };
  if (origin) {
    headers["access-control-allow-origin"] = origin;
  }
  return headers;
}

function applyCors(response: Response, request: Request): Response {
  const headers = new Headers(response.headers);
  const cors = corsHeaders(request);
  for (const [key, value] of Object.entries(cors)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

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
        headers: corsHeaders(request),
      });
    }

    setRequestEnv(request, env);
    const response = await app.fetch(request);
    return applyCors(response, request);
  },

  async request(
    input: string | Request,
    init?: RequestInit,
    env: Env = {} as Env
  ): Promise<Response> {
    const request = createRequest(input, init);
    return this.fetch(request, env, {} as ExecutionContext);
  },
};
