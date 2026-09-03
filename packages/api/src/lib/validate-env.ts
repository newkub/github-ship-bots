import type { Env } from "@ship-feed/shared";

export const REQUIRED_RUNTIME_ENV = [
  "DB",
  "EVIDENCE_BUCKET",
  "BASELINE_BUCKET",
  "SESSION_KV",
  "PUBLIC_APP_URL",
] as const;

export function validateRuntimeEnv(env: Env): string[] {
  const missing: string[] = [];
  for (const key of REQUIRED_RUNTIME_ENV) {
    const value = env[key as keyof Env];
    if (value === undefined || value === null || value === "") {
      missing.push(key);
    }
  }
  return missing;
}
