import { Elysia, t } from "elysia";
import { WorkOS } from "@workos-inc/node";
import { setSession, getSession, deleteSession } from "../lib/session";
import { generateId, now } from "@ship-feed/shared";
import { withEnv } from "../lib/env";
import { assertEnumValue } from "@ship-feed/shared";
import type { User, PlanTier } from "@ship-feed/shared";
import { getGitHubLoginFromToken } from "../lib/github-user";

const PLAN_TIERS: readonly PlanTier[] = ["free", "pro", "team"];

const auth = withEnv(new Elysia({ prefix: "/auth" }));

function fallbackGitHubLogin(profile: { email?: string | null; firstName?: string | null }): string | undefined {
  if (profile.firstName) return profile.firstName;
  if (profile.email) {
    const local = profile.email.split("@")[0];
    if (local) return local;
  }
  return undefined;
}

async function githubLoginFromProfile(
  profile: { email?: string | null; firstName?: string | null },
  token?: string
): Promise<string | undefined> {
  if (token) {
    const login = await getGitHubLoginFromToken(token);
    if (login) return login;
  }
  return fallbackGitHubLogin(profile);
}

function redirectUrl(env: { WORKOS_REDIRECT_URI?: string; PUBLIC_APP_URL: string }): string {
  return env.WORKOS_REDIRECT_URI || `${env.PUBLIC_APP_URL}/auth/callback`;
}

auth.get("/login", async ({ request, env, set, redirect }) => {
  const workos = new WorkOS(env.WORKOS_API_KEY);
  const redirectUri = redirectUrl(env);
  const state = crypto.randomUUID();

  if (env.SESSION_KV) {
    await env.SESSION_KV.put(`oauth_state:${state}`, "1", { expirationTtl: 600 });
  }

  const url = workos.userManagement.getAuthorizationUrl({
    clientId: env.WORKOS_CLIENT_ID,
    redirectUri,
    provider: "GitHubOAuth",
    state,
  });

  // Prefer HTML redirect for better cookie handling
  if (request.headers.get("accept")?.includes("text/html")) {
    set.headers["set-cookie"] = `ship_feed_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`;
  }

  return redirect(url);
});

const callbackQuery = t.Object({
  code: t.String({ minLength: 1 }),
  state: t.String({ minLength: 1 }),
});

auth.get(
  "/callback",
  async ({ request, set, env, redirect, query }) => {
    const code = query.code;
    if (!code) {
      set.status = 400;
      return { error: "missing code" };
    }

    const state = query.state;
    if (!state) {
      set.status = 400;
      return { error: "missing state" };
    }

    const stateKey = `oauth_state:${state}`;
    const stateCookie = request.headers.get("Cookie")?.match(/ship_feed_oauth_state=([^;]+)/)?.[1];

    if (env.SESSION_KV) {
      const stored = await env.SESSION_KV.get(stateKey);
      if (stored !== "1" && (!stateCookie || stateCookie !== state)) {
        set.status = 401;
        return { error: "invalid state" };
      }
      await env.SESSION_KV.delete(stateKey);
    } else if (!stateCookie || stateCookie !== state) {
      set.status = 401;
      return { error: "invalid state" };
    }

    const workos = new WorkOS(env.WORKOS_API_KEY);
    const redirectUri = redirectUrl(env);

    const resp = await workos.userManagement.authenticateWithCode({
      clientId: env.WORKOS_CLIENT_ID,
      code,
    });

    const profile = resp.user;
    if (!profile.email && !profile.firstName) {
      set.status = 400;
      return { error: "incomplete user profile" };
    }

    const oauthTokens = (resp as { oauthTokens?: { accessToken?: string; providerAccessToken?: string } }).oauthTokens;
    const providerToken = oauthTokens?.providerAccessToken || oauthTokens?.accessToken;

    const githubLogin = await githubLoginFromProfile(profile, providerToken);
    if (!githubLogin) {
      set.status = 400;
      return { error: "unable to determine GitHub login" };
    }

    const row = await env.DB.prepare(
      "SELECT id, github_login, email, workos_user_id, plan, created_at FROM users WHERE github_login = ?"
    )
      .bind(githubLogin)
      .first<Record<string, unknown>>();

    let user: User;

    if (row) {
      user = {
        id: String(row.id),
        githubLogin: String(row.github_login),
        email: row.email ? String(row.email) : undefined,
        workosUserId: row.workos_user_id ? String(row.workos_user_id) : undefined,
        plan: assertEnumValue(row.plan, PLAN_TIERS, "plan"),
        createdAt: String(row.created_at),
      };
    } else {
      const id = generateId();
      const createdAt = now();
      await env.DB.prepare(
        "INSERT INTO users (id, github_login, email, workos_user_id, plan, created_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
        .bind(
          id,
          githubLogin,
          profile.email ?? null,
          profile.id,
          "free",
          createdAt
        )
        .run();
      user = {
        id,
        githubLogin,
        email: profile.email ?? undefined,
        workosUserId: profile.id,
        plan: "free",
        createdAt,
      };
    }

    await setSession({ request, set, env }, user);
    return redirect(`${env.PUBLIC_APP_URL}/dashboard/`);
  },
  { query: callbackQuery }
);

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
