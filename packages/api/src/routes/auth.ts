import { Elysia } from "elysia";
import { WorkOS } from "@workos-inc/node";
import { setSession, getSession, deleteSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import { withEnv } from "../lib/env";
import type { User } from "@ship-feed/shared";

const auth = withEnv(new Elysia({ prefix: "/auth" }));

auth.get("/login", ({ request, env, redirect }) => {
  const workos = new WorkOS(env.WORKOS_API_KEY);
  const origin = request.headers.get("origin") ?? "";
  const redirectUri = origin.startsWith("http://localhost")
    ? "http://localhost:5174/auth/callback"
    : `${env.PUBLIC_APP_URL}/auth/callback`;

  const url = workos.userManagement.getAuthorizationUrl({
    clientId: env.WORKOS_CLIENT_ID,
    redirectUri,
    provider: "GitHubOAuth",
  });

  return redirect(url);
});

auth.get("/callback", async ({ request, set, env, redirect, query }) => {
  const code = query.code;
  if (!code) {
    return "Missing code";
  }

  const workos = new WorkOS(env.WORKOS_API_KEY);
  const origin = request.headers.get("origin") ?? "";
  const redirectUri = origin.startsWith("http://localhost")
    ? "http://localhost:5174/auth/callback"
    : `${env.PUBLIC_APP_URL}/auth/callback`;

  const resp = await workos.userManagement.authenticateWithCode({
    clientId: env.WORKOS_CLIENT_ID,
    code,
  });

  const profile = resp.user;
  const githubLogin = profile.email.split("@")[0] ?? profile.email;

  let user = await env.DB.prepare(
    "SELECT * FROM users WHERE github_login = ?"
  )
    .bind(githubLogin)
    .first<User>();

  if (!user) {
    const id = generateId();
    await env.DB.prepare(
      "INSERT INTO users (id, github_login, email, workos_user_id, plan, created_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(
        id,
        githubLogin,
        profile.email ?? null,
        profile.id,
        "free",
        now()
      )
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

  await setSession({ request, set, env }, user as User);
  return redirect(`${env.PUBLIC_APP_URL}/dashboard/`);
});

auth.get("/session", async ({ request, set, env }) => {
  const user = await getSession({ request, set, env });
  if (!user) return { user: null };
  return { user };
});

auth.post("/logout", async ({ request, set, env }) => {
  await deleteSession({ request, set, env });
  return { ok: true };
});

export default auth;
