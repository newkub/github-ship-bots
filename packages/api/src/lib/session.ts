import { getSignedCookie, setSignedCookie } from "hono/cookie";
import type { Context } from "hono";
import type { Env, User } from "@ship-feed/shared";

const COOKIE = "ship_feed_session";

export async function getSession(c: Context<{ Bindings: Env }>): Promise<User | null> {
  const sessionId = await getSignedCookie(c, c.env.WORKOS_COOKIE_PASSWORD, COOKIE);
  if (!sessionId) return null;
  const raw = await c.env.SESSION_KV.get(`session:${sessionId}`);
  if (!raw) return null;
  return JSON.parse(raw) as User;
}

export async function setSession(c: Context<{ Bindings: Env }>, user: User): Promise<string> {
  const sessionId = crypto.randomUUID();
  await c.env.SESSION_KV.put(`session:${sessionId}`, JSON.stringify(user), { expirationTtl: 86400 });
  await setSignedCookie(c, COOKIE, sessionId, c.env.WORKOS_COOKIE_PASSWORD, {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 86400,
  });
  return sessionId;
}
