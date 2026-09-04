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
  if (!env.DB) {
    return { allowed: false, remaining: 0, retryAfter: windowSeconds };
  }

  const ip = clientIp(request);
  const nowMs = Date.now();
  const windowStart = Math.floor(nowMs / (windowSeconds * 1000));
  const expiresAt = (windowStart + 1) * windowSeconds * 1000;
  const key = `rate:${ip}:${windowStart}`;

  await env.DB.prepare(
    `INSERT INTO rate_limits (id, count, expires_at) VALUES (?, 1, ?)
     ON CONFLICT(id) DO UPDATE SET
       count = CASE WHEN rate_limits.expires_at >= excluded.expires_at THEN rate_limits.count + 1 ELSE 1 END,
       expires_at = CASE WHEN rate_limits.expires_at >= excluded.expires_at THEN rate_limits.expires_at ELSE excluded.expires_at END`
  )
    .bind(key, expiresAt)
    .run();

  const row = await env.DB.prepare("SELECT count, expires_at FROM rate_limits WHERE id = ?")
    .bind(key)
    .first<{ count: number; expires_at: number }>();

  if (!row) {
    return { allowed: false, remaining: 0, retryAfter: windowSeconds };
  }

  if (row.count > limit) {
    const retryAfter = Math.max(0, Math.ceil((row.expires_at - nowMs) / 1000));
    return { allowed: false, remaining: 0, retryAfter };
  }

  return { allowed: true, remaining: Math.max(0, limit - row.count), retryAfter: 0 };
}
