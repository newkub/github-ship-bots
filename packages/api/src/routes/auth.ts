import { Elysia } from "elysia";
import { WorkOS } from "@workos-inc/node";
import { setSession, getSession, deleteSession } from "../lib/session";
import { generateId, now } from "../lib/db";
import { withEnv } from "../lib/env";
import type { User, Env } from "@ship-feed/shared";
const auth = withEnv(new Elysia({ prefix: "/auth" }));
function getAllowedOrigins(env: Env): string[] {
  const configured = env.CORS_ALLOWED_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  return [
    ...configured,
    env.PUBLIC_APP_URL,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
  ].filter((value, index, self) => Boolean(value) && self.indexOf(value) === index);
}
function getAuthRedirectUri(origin: string | null, env: Env): string | null {
  const allowed = getAllowedOrigins(env);
  if (origin && allowed.includes(origin)) {
    return `${origin}/auth/callback`;
  }
  if (env.PUBLIC_APP_URL) {
    return `${env.PUBLIC_APP_URL}/auth/callback`;
  }
  return null;
}
function sanitizeGitHubLogin(email: string | undefined, fallback: string): string {
  const raw = email?.split("@")[0]?.trim() ?? fallback;
  const sanitized = raw.replace(/[^a-zA-Z0-9-]/g, "");
  if (sanitized.length >= 1 && sanitized.length <= 39 && !sanitized.startsWith("-") && !sanitized.endsWith("-")) {
    return sanitized;
  }
  const safeFallback = `user-${fallback.replace(/[^a-zA-Z0-9]/g, "")}`;
  return safeFallback.slice(0, 39);
}
auth.get("/login", ({ request, env, redirect, set }) => {
  const workos = new WorkOS(env.WORKOS_API_KEY);
  const origin = request.headers.get("origin");
  const redirectUri = getAuthRedirectUri(origin, env);
  if (!redirectUri) {
    set.status = 503;
    return { error: "PUBLIC_APP_URL not configured" };
  }
  const url = workos.userManagement.getAuthorizationUrl({
    clientId: env.WORKOS_CLIENT_ID,
    redirectUri,
    provider: "GitHubOAuth",
  });
  return redirect(url);
});
auth.get("/callback", async ({ request, set, env, redirect, query }) => {
  const code = typeof query.code === "string" ? query.code : undefined;
  if (!code || code.length === 0) {
    set.status = 400;
    return { error: "Missing code" };
  }
  const origin = request.headers.get("origin");
  const redirectUri = getAuthRedirectUri(origin, env);
  if (!redirectUri) {
    set.status = 503;
    return { error: "PUBLIC_APP_URL not configured" };
  }
  const workos = new WorkOS(env.WORKOS_API_KEY);
  const resp = await workos.userManagement.authenticateWithCode({
    clientId: env.WORKOS_CLIENT_ID,
    code,
  });
  const profile = resp.user;
  const githubLogin = sanitizeGitHubLogin(profile.email, profile.id);
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
