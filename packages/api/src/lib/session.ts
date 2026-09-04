import { assertUser } from "@ship-feed/shared";
import type { User } from "@ship-feed/shared";
import type { SessionContext } from "./env";
import {
  getSignedCookie,
  serializeSignedCookie,
  serializeCookie,
} from "./cookie";

const COOKIE = "ship_feed_session";
const BEARER = "bearer ";

function cookieOptions(maxAge: number) {
  return {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "Lax" as const,
    maxAge,
  };
}

async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(input));
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function getUserFromToken(db: D1Database, token: string): Promise<User | null> {
  const hash = await sha256Hex(token);
  const tokenRow = await db
    .prepare("SELECT user_id, scopes FROM api_tokens WHERE token_hash = ?")
    .bind(hash)
    .first<{ user_id: string; scopes: string }>();
  if (!tokenRow) return null;
  const userRow = await db
    .prepare("SELECT id, github_login, email, workos_user_id, plan, stripe_customer_id, created_at FROM users WHERE id = ?")
    .bind(tokenRow.user_id)
    .first<Record<string, unknown>>();
  if (!userRow) return null;
  await db.prepare("UPDATE api_tokens SET last_used_at = ? WHERE token_hash = ?").bind(new Date().toISOString(), hash).run();
  return assertUser({
    id: userRow.id,
    githubLogin: userRow.github_login,
    email: userRow.email,
    workosUserId: userRow.workos_user_id,
    plan: userRow.plan,
    stripeCustomerId: userRow.stripe_customer_id,
    createdAt: userRow.created_at,
  });
}

export async function getSession(c: SessionContext): Promise<User | null> {
  const auth = c.request.headers.get("Authorization");
  if (auth?.toLowerCase().startsWith(BEARER)) {
    const token = auth.slice(BEARER.length).trim();
    if (token) return getUserFromToken(c.env.DB, token);
  }
  if (!c.env.WORKOS_COOKIE_PASSWORD) return null;
  const cookieHeader = c.request.headers.get("Cookie");
  const sessionId = await getSignedCookie(
    cookieHeader,
    c.env.WORKOS_COOKIE_PASSWORD,
    COOKIE
  );
  if (!sessionId) return null;
  const raw = await c.env.SESSION_KV.get(`session:${sessionId}`);
  if (!raw) return null;
  return assertUser(JSON.parse(raw));
}

export async function setSession(
  c: SessionContext,
  user: User
): Promise<string> {
  if (!c.env.WORKOS_COOKIE_PASSWORD) throw new Error("Missing WORKOS_COOKIE_PASSWORD");
  const sessionId = crypto.randomUUID();
  await c.env.SESSION_KV.put(
    `session:${sessionId}`,
    JSON.stringify(user),
    { expirationTtl: 86400 }
  );
  const cookie = await serializeSignedCookie(
    COOKIE,
    sessionId,
    c.env.WORKOS_COOKIE_PASSWORD,
    cookieOptions(86400)
  );
  c.set.headers["set-cookie"] = cookie;
  return sessionId;
}

export async function deleteSession(c: SessionContext): Promise<void> {
  if (!c.env.WORKOS_COOKIE_PASSWORD) return;
  const cookieHeader = c.request.headers.get("Cookie");
  const sessionId = await getSignedCookie(
    cookieHeader,
    c.env.WORKOS_COOKIE_PASSWORD,
    COOKIE
  );
  if (sessionId) {
    await c.env.SESSION_KV.delete(`session:${sessionId}`);
  }
  c.set.headers["set-cookie"] = serializeCookie(
    COOKIE,
    "",
    { ...cookieOptions(0), maxAge: 0 }
  );
}
