import { Elysia, type Context } from "elysia";
import type { Env } from "@ship-feed/shared";

const envByRequest = new WeakMap<Request, Env>();

export function setRequestEnv(request: Request, env: Env): void {
  envByRequest.set(request, env);
}

export function getRequestEnv(request: Request): Env | undefined {
  return envByRequest.get(request);
}

export function withEnv<const BasePath extends string = "">(
  app: Elysia<BasePath>
) {
  return app.derive(({ request }) => {
    const env = getRequestEnv(request);
    if (!env) {
      throw new Error("Missing Env for request");
    }
    return { env } satisfies { env: Env };
  });
}

export interface SessionContext {
  request: Request;
  set: Context["set"];
  env: Env;
}
