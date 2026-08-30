import { Hono } from "hono";
import { WorkOS } from "@workos-inc/node";
import { setSession, getSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import type { Env, User } from "@ship-feed/shared";

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
    redirectUri,
  });

  const profile = resp.user;
  const github = resp.user.identities?.find((i) => i.provider === "GitHubOAuth");
  const githubLogin = github?.rawAttributes?.login ?? profile.email?.split("@")[0] ?? "user";

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

  await setSession(c, user);
  return c.redirect(`${c.env.PUBLIC_APP_URL}/`);
});

auth.get("/session", async (c) => {
  const user = await getSession(c);
  if (!user) return c.json({ user: null });
  return c.json({ user });
});

auth.post("/logout", async (c) => {
  const sessionId = c.req.cookie("ship_feed_session");
  if (sessionId) await c.env.SESSION_KV.delete(`session:${sessionId}`);
  return c.json({ ok: true });
});

export default auth;
