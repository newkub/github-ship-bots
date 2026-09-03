import type { Env } from "@ship-feed/shared";

export function getAllowedOrigins(env: Env): string[] {
  const configured = env.CORS_ALLOWED_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  return [
    ...configured,
    env.PUBLIC_APP_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ].filter((value, index, self) => Boolean(value) && self.indexOf(value) === index);
}

function matchedOrigin(request: Request, env: Env): string | undefined {
  const origin = request.headers.get("origin");
  if (!origin) return undefined;
  return getAllowedOrigins(env).includes(origin) ? origin : undefined;
}

export function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = matchedOrigin(request, env);
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

export function applyCors(response: Response, request: Request, env: Env): Response {
  const headers = new Headers(response.headers);
  const cors = corsHeaders(request, env);
  for (const [key, value] of Object.entries(cors)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
