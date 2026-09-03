import type { Env } from "@ship-feed/shared";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
}

function clientIp(request: Request): string {
  const headers = request.headers;
  return (
    headers.get("cf-connecting-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function checkRateLimit(
  env: Env,
  request: Request,
  limit = 100,
  windowSeconds = 60
): Promise<RateLimitResult> {
  if (!env.SESSION_KV) {
    return { allowed: false, remaining: 0, retryAfter: windowSeconds };
  }

  const ip = clientIp(request);
  const windowStart = Math.floor(Date.now() / (windowSeconds * 1000));
  const key = `rate:${ip}:${windowStart}`;

  const current = await env.SESSION_KV.get(key);
  const count = current ? parseInt(current, 10) : 0;
  if (Number.isNaN(count)) {
    return { allowed: false, remaining: 0, retryAfter: windowSeconds };
  }

  if (count >= limit) {
    return { allowed: false, remaining: 0, retryAfter: windowSeconds };
  }

  await env.SESSION_KV.put(key, String(count + 1), { expirationTtl: windowSeconds });

  return { allowed: true, remaining: limit - count - 1, retryAfter: 0 };
}
