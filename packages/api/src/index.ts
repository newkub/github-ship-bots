import type { Env } from "@ship-feed/shared";
import { createApp } from "./app";
import { handleRequest } from "./middleware";

const app = createApp();

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx?: ExecutionContext
  ): Promise<Response> {
    return handleRequest(app, request, env);
  },
};
