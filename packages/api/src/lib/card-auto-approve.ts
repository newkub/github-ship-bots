import type { Env, ShipCard } from "@ship-feed/shared";

export function parseAutoApproveThreshold(env: Env): number {
  const raw = env.AUTO_APPROVE_THRESHOLD;
  if (!raw) return 8.5;
  const value = Number(raw);
  return Number.isFinite(value) ? value : 8.5;
}

export function parseAutoApproveRisk(env: Env): Set<string> {
  const raw = env.AUTO_APPROVE_RISK;
  const defaults = new Set(["low"]);
  if (!raw) return defaults;
  const values = raw.split(",").map((r) => r.trim());
  return new Set(values.length > 0 ? values : ["low"]);
}

export function shouldAutoApprove(env: Env, card: ShipCard): boolean {
  const threshold = parseAutoApproveThreshold(env);
  const allowedRisks = parseAutoApproveRisk(env);
  return card.score >= threshold && allowedRisks.has(card.risk);
}
