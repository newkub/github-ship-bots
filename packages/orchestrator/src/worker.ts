import { createContext, runShipLoop } from "./index";
import type { Env } from "@ship-feed/shared";

export default {
  async fetch(_request: Request, env: Env) {
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
    const ctx = createContext(env);
    console.log("[ship-feed] cron running");
    await runShipLoop(ctx);
    console.log("[ship-feed] cron done");
  },
};
