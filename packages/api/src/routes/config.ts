import { Elysia } from "elysia";
import { withEnv } from "../lib/env";

const config = withEnv(new Elysia({ prefix: "/api/config" }));

config.get("/", ({ env }) => {
  if (!env.GITHUB_APP_NAME || !env.AUTO_APPROVE_THRESHOLD || !env.AUTO_APPROVE_RISK) {
    throw new Error("Missing required configuration");
  }
  const threshold = Number(env.AUTO_APPROVE_THRESHOLD);
  if (Number.isNaN(threshold)) {
    throw new Error("Invalid AUTO_APPROVE_THRESHOLD");
  }
  return {
    appUrl: env.PUBLIC_APP_URL,
    githubAppName: env.GITHUB_APP_NAME,
    autoApproveThreshold: threshold,
    autoApproveRisk: env.AUTO_APPROVE_RISK,
  };
});

export default config;
