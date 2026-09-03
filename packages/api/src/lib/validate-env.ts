import type { Env } from "@ship-feed/shared";

export const REQUIRED_RUNTIME_ENV = [
  "DB",
  "EVIDENCE_BUCKET",
  "BASELINE_BUCKET",
  "SESSION_KV",
  "PUBLIC_APP_URL",
  "WORKOS_API_KEY",
  "WORKOS_CLIENT_ID",
  "WORKOS_COOKIE_PASSWORD",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_PRO",
  "GITHUB_APP_ID",
  "GITHUB_APP_PRIVATE_KEY",
  "GITHUB_WEBHOOK_SECRET",
] as const satisfies ReadonlyArray<keyof Env>;

export function validateRuntimeEnv(env: Env): string[] {
  const missing: string[] = [];
  for (const key of REQUIRED_RUNTIME_ENV) {
    const value = env[key];
    if (value === undefined || value === null || value === "") {
      missing.push(key);
    }
  }
  return missing;
}
