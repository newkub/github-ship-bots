import { App } from "@octokit/app";
import { verifyWebhookSignature } from "./lib/verify.ts";
import { issuesHandler } from "./handlers/issues.ts";
import { pullRequestHandler } from "./handlers/pull-request.ts";

interface AssetFetcher {
  fetch: (request: Request) => Promise<Response>;
}

export interface Env {
  APP_ID: string;
  PRIVATE_KEY: string;
  WEBHOOK_SECRET: string;
  ASSETS: AssetFetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    const app = new App({
      appId: env.APP_ID,
      privateKey: env.PRIVATE_KEY,
      webhooks: { secret: env.WEBHOOK_SECRET },
    });

    issuesHandler(app.webhooks as any);
    pullRequestHandler(app.webhooks as any);

    if (request.method === "POST" && url.pathname === "/webhook") {
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

      const payload = JSON.parse(payloadString);

      try {
        await app.webhooks.receive({ id, name: name as any, payload });
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
