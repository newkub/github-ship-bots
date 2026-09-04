import type { Env } from "@ship-feed/shared";

type EnvKey = keyof Env;

const BASE_REQUIRED: EnvKey[] = ["DB", "EVIDENCE_BUCKET", "BASELINE_BUCKET", "SESSION_KV", "PUBLIC_APP_URL", "GITHUB_APP_NAME", "AUTO_APPROVE_THRESHOLD", "AUTO_APPROVE_RISK"];

const ROUTE_REQUIRED: Record<string, EnvKey[]> = {
  "/auth": ["WORKOS_API_KEY", "WORKOS_CLIENT_ID", "WORKOS_COOKIE_PASSWORD"],
  "/api/stripe": ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_PRICE_PRO"],
};

const OPTIONAL_GROUPS: EnvKey[] = [
  "WORKOS_REDIRECT_URI",
  "BOT_TOKEN",
  "VAPID_PUBLIC_KEY",
  "VAPID_PRIVATE_KEY",
  "VAPID_SUBJECT",
  "CORS_ALLOWED_ORIGINS",
  "ADMIN_LOGINS",
  "SLACK_WEBHOOK_URL",
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
  "OPENAI_API_KEY",
  "OPENAI_API_URL",
];

export function validateRuntimeEnv(env: Env, pathname: string): string[] {
  const required = new Set<EnvKey>(BASE_REQUIRED);
  for (const [prefix, keys] of Object.entries(ROUTE_REQUIRED)) {
    if (pathname.startsWith(prefix)) {
      for (const key of keys) required.add(key);
    }
  }

  const missing: string[] = [];
  for (const key of required) {
    const value = env[key];
    if (value === undefined || value === null || value === "") {
      missing.push(key);
    }
  }
  return missing;
}

export function isOptionalEnv(key: EnvKey): boolean {
  return OPTIONAL_GROUPS.includes(key);
}
