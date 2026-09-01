import { Hono } from "hono";
import { WorkOS } from "@workos-inc/node";
import { setSession, getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import type { Env, User } from "@ship-feed/shared";
import { getSignedCookie, deleteCookie } from "hono/cookie";

const auth = new Hono<{ Bindings: Env }>();

auth.get("/login", (c) => {
  const workos = new WorkOS(c.env.WORKOS_API_KEY);
  const redirectUri = c.req.header("origin")?.startsWith("http://localhost")
    ? "http://localhost:5174/auth/callback"
    : `${c.env.PUBLIC_APP_URL}/auth/callback`;

  const url = workos.userManagement.getAuthorizationUrl({
    clientId: c.env.WORKOS_CLIENT_ID,
    redirectUri,
    provider: "GitHubOAuth",
  });

  return c.redirect(url);
});

auth.get("/callback", async (c) => {
  const code = c.req.query("code");
  if (!code) return c.text("Missing code", 400);

  const workos = new WorkOS(c.env.WORKOS_API_KEY);
  const redirectUri = c.req.header("origin")?.startsWith("http://localhost")
    ? "http://localhost:5174/auth/callback"
    : `${c.env.PUBLIC_APP_URL}/auth/callback`;

  const resp = await workos.userManagement.authenticateWithCode({
    clientId: c.env.WORKOS_CLIENT_ID,
    code,
  });

  const profile = resp.user;
  const githubLogin = profile.email.split("@")[0] ?? profile.email;

  let user = await c.env.DB.prepare("SELECT * FROM users WHERE github_login = ?")
    .bind(githubLogin)
    .first<User>();

  if (!user) {
    const id = generateId();
    await c.env.DB.prepare(
      "INSERT INTO users (id, github_login, email, workos_user_id, plan, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(id, githubLogin, profile.email ?? null, profile.id, "free", now())
      .run();
    user = {
      id,
      githubLogin,
      email: profile.email,
      workosUserId: profile.id,
      plan: "free",
      createdAt: now(),
    };
  }

  await setSession(c, user as User);
  return c.redirect(`${c.env.PUBLIC_APP_URL}/`);
});

auth.get("/session", async (c) => {
  const user = await getSession(c);
  if (!user) return c.json({ user: null });
  return c.json({ user });
});

auth.post("/logout", async (c) => {
  const sessionId = await getSignedCookie(c, c.env.WORKOS_COOKIE_PASSWORD, "ship_feed_session");
  if (sessionId) await c.env.SESSION_KV.delete(`session:${sessionId}`);
  deleteCookie(c, "ship_feed_session");
  return c.json({ ok: true });
});

export default auth;
