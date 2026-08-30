import { App } from "@octokit/app";
import { Octokit } from "@octokit/rest";
import type { Env } from "./worker.ts";

export function createShipFeedApp(env: Env) {
  return new App({
    appId: env.APP_ID,
    privateKey: env.PRIVATE_KEY,
    webhooks: { secret: env.WEBHOOK_SECRET },
    Octokit,
  });
}
