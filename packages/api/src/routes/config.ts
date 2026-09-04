import { Elysia } from "elysia";
import { withEnv } from "../lib/env";

const config = withEnv(new Elysia({ prefix: "/api/config" }));

config.get("/", ({ env }) => ({
  appUrl: env.PUBLIC_APP_URL,
  githubAppName: env.GITHUB_APP_NAME ?? "wrikka-ship-bot",
  autoApproveThreshold: Number(env.AUTO_APPROVE_THRESHOLD ?? "8.5"),
  autoApproveRisk: env.AUTO_APPROVE_RISK ?? "low",
}));

export default config;
