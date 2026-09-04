import { Elysia } from "elysia";
import { WorkOS } from "@workos-inc/node";
import { withEnv } from "../../lib/env";

function redirectUrl(env: { WORKOS_REDIRECT_URI?: string; PUBLIC_APP_URL: string }): string {
  return env.WORKOS_REDIRECT_URI || `${env.PUBLIC_APP_URL}/auth/callback`;
}

const login = withEnv(new Elysia({ prefix: "/auth" }));

login.get("/login", async ({ request, env, set, redirect }) => {
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

  if (request.headers.get("accept")?.includes("text/html")) {
    set.headers["set-cookie"] = `ship_feed_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`;
  }

  return redirect(url);
});

export default login;
