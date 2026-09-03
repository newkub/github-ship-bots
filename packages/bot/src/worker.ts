import { createShipFeedApp } from "./app";
import { verifyWebhookSignature } from "./lib/verify";
import { issuesHandler } from "./handlers/issues";
import { pullRequestHandler } from "./handlers/pull-request";
import { runWithBotEnv } from "./lib/api";
import type { BotEnv, ShipFeedWebhooks } from "./types";

interface AssetFetcher {
  fetch: (request: Request) => Promise<Response>;
}
export interface Env extends BotEnv {
  ASSETS: AssetFetcher;
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/webhook") {
      if (!env.PRIVATE_KEY || !env.APP_ID || !env.WEBHOOK_SECRET) {
        return new Response(JSON.stringify({ error: "Missing app credentials" }), {
          status: 503,
          headers: { "content-type": "application/json" },
        });
      }
      const app = createShipFeedApp(env);
      const webhooks = app.webhooks as unknown as ShipFeedWebhooks;
      issuesHandler(webhooks);
      pullRequestHandler(webhooks);
      const id = request.headers.get("x-github-delivery") ?? "";
      const name = request.headers.get("x-github-event") ?? "";
      const signature = request.headers.get("x-hub-signature-256") ?? "";
      const payloadString = await request.text();
      try {
        await verifyWebhookSignature(payloadString, signature, env.WEBHOOK_SECRET);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Invalid signature";
        return new Response(JSON.stringify({ error: message }), {
          status: 400,
          headers: { "content-type": "application/json" },
        });
      }
      let payload: unknown;
      try {
        payload = JSON.parse(payloadString) as unknown;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Invalid JSON";
        return new Response(JSON.stringify({ error: `Malformed payload: ${message}` }), {
          status: 400,
          headers: { "content-type": "application/json" },
        });
      }
      try {
        await runWithBotEnv(env, () => webhooks.receive({ id, name, payload }));
        return new Response(JSON.stringify({ ok: true }), {
          headers: { "content-type": "application/json" },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Webhook error";
        return new Response(JSON.stringify({ error: message }), {
          status: 500,
          headers: { "content-type": "application/json" },
        });
      }
    }
    return env.ASSETS.fetch(request);
  },
};
