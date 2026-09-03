import { App } from "@octokit/app";
import { Octokit } from "@octokit/rest";
import type { BotEnv } from "./types";

export function createShipFeedApp(env: BotEnv) {
  return new App({
    appId: env.APP_ID,
    privateKey: env.PRIVATE_KEY,
    webhooks: { secret: env.WEBHOOK_SECRET },
    Octokit,
  });
}
