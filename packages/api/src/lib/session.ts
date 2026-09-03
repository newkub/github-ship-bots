import { assertUser } from "@ship-feed/shared";
import type { User } from "@ship-feed/shared";
import type { SessionContext } from "./env";
import {
  getSignedCookie,
  serializeSignedCookie,
  serializeCookie,
} from "./cookie";

const COOKIE = "ship_feed_session";

function cookieOptions(maxAge: number) {
  return {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "Lax" as const,
    maxAge,
  };
}

export async function getSession(c: SessionContext): Promise<User | null> {
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
