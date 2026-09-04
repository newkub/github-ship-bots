import { createContext, runShipLoop } from "./index";
import type { Env } from "@ship-feed/shared";
import { logger } from "./lib/logger";

function validateShipEnv(env: Env): string[] {
  const missing: string[] = [];
  if (!env.DB) missing.push("DB");
  if (!env.GITHUB_APP_ID) missing.push("GITHUB_APP_ID");
  if (!env.GITHUB_APP_PRIVATE_KEY) missing.push("GITHUB_APP_PRIVATE_KEY");
  if (!env.PUBLIC_APP_URL) missing.push("PUBLIC_APP_URL");
  return missing;
}

export default {
  async fetch(_request: Request, env: Env) {
    const missing = validateShipEnv(env);
    if (missing.length > 0) {
      return new Response(JSON.stringify({ error: "service unavailable", missing }), { status: 503 });
    }
    const ctx = createContext(env);
    try {
      const result = await runShipLoop(ctx);
      return new Response(JSON.stringify({ ok: true, ...result }), {
        headers: { "content-type": "application/json" },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "ship loop error";
      return new Response(JSON.stringify({ error: message }), { status: 500 });
    }
  },

  async scheduled(_controller: ScheduledController, env: Env, _ctx: ExecutionContext) {
    const missing = validateShipEnv(env);
    if (missing.length > 0) {
      logger.error("cron skipped, missing environment", { missing });
      return;
    }
    const ctx = createContext(env);
    logger.info("cron running", { correlationId: ctx.correlationId });
    await runShipLoop(ctx);
    logger.info("cron done", { correlationId: ctx.correlationId });
  },
};
