import { Elysia, t } from "elysia";
import { WorkOS } from "@workos-inc/node";
import { setSession } from "../../lib/session";
import { generateId, now, assertEnumValue, assertRecord } from "@ship-feed/shared";
import { withEnv } from "../../lib/env";
import type { User, PlanTier } from "@ship-feed/shared";
import { getGitHubLoginFromToken } from "../../lib/github-user";

const PLAN_TIERS: readonly PlanTier[] = ["free", "pro", "team"];

function redirectUrl(env: { WORKOS_REDIRECT_URI?: string; PUBLIC_APP_URL: string }): string {
  return env.WORKOS_REDIRECT_URI || `${env.PUBLIC_APP_URL}/auth/callback`;
}

async function githubLoginFromProfile(token?: string): Promise<string | undefined> {
  if (!token) return undefined;
  return getGitHubLoginFromToken(token);
}

const callbackQuery = t.Object({
  code: t.String({ minLength: 1 }),
  state: t.String({ minLength: 1 }),
});

const callback = withEnv(new Elysia({ prefix: "/auth" }));

callback.get(
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

    const workosRecord = assertRecord(resp as unknown, "WorkOS response");
    const oauthTokens = workosRecord.oauthTokens;
    let providerToken: string | undefined;
    if (oauthTokens !== null && typeof oauthTokens === "object") {
      const tokens = assertRecord(oauthTokens, "WorkOS oauth tokens");
      if (typeof tokens.providerAccessToken === "string" && tokens.providerAccessToken) {
        providerToken = tokens.providerAccessToken;
      }
    }

    if (!providerToken) {
      set.status = 400;
      return { error: "missing GitHub access token from WorkOS" };
    }

    let githubLogin: string | undefined;
    try {
      githubLogin = await githubLoginFromProfile(providerToken);
    } catch (err) {
      set.status = 400;
      return { error: `GitHub login lookup failed: ${err instanceof Error ? err.message : String(err)}` };
    }
    if (!githubLogin) {
      set.status = 400;
      return { error: "GitHub login not found in token response" };
    }

    const row = await env.DB.prepare(
      "SELECT id, github_login, email, workos_user_id, plan, stripe_customer_id, created_at FROM users WHERE github_login = ?"
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
        stripeCustomerId: row.stripe_customer_id ? String(row.stripe_customer_id) : undefined,
        plan: assertEnumValue(row.plan, PLAN_TIERS, "plan"),
        createdAt: String(row.created_at),
      };
    } else {
      const id = generateId();
      const createdAt = now();
      await env.DB.prepare(
        "INSERT INTO users (id, github_login, email, workos_user_id, plan, created_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
        .bind(id, githubLogin, profile.email ?? null, profile.id, "free", createdAt)
        .run();
      user = {
        id,
        githubLogin,
        email: profile.email ?? undefined,
        workosUserId: profile.id,
        stripeCustomerId: undefined,
        plan: "free",
        createdAt,
      };
    }

    await setSession({ request, set, env }, user);
    return redirect(`${env.PUBLIC_APP_URL}/dashboard/`);
  },
  { query: callbackQuery }
);

export default callback;
