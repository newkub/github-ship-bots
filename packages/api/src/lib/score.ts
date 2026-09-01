import type { D1Database } from "@cloudflare/workers-types";
import type { ShipCard } from "@ship-feed/shared";

const impactMap = { high: 3, medium: 2, low: 1 };
const effectMap = { high: 3, medium: 2, low: 1 };
const riskMap = { high: -2, medium: -1, low: 0 };

export function baseScore(impact: ShipCard["impact"], risk: ShipCard["risk"], effect: ShipCard["effect"]) {
  return Math.max(0, (impactMap[impact] || 0) + (effectMap[effect] || 0) + (riskMap[risk] || 0));
}

export async function autoScore(
  db: D1Database,
  repoFullName: string,
  features: Pick<ShipCard, "kind" | "impact" | "risk" | "effect" | "phase">
): Promise<number> {
  const featureList = [
    { name: "kind", value: features.kind },
    { name: "impact", value: features.impact },
    { name: "risk", value: features.risk },
    { name: "effect", value: features.effect },
    { name: "phase", value: features.phase },
  ];

  let total = 0;
  for (const f of featureList) {
    const row = await db
      .prepare("SELECT weight FROM learning_weights WHERE repo_full_name = ? AND feature = ?")
      .bind(repoFullName, `${f.name}:${f.value}`)
      .first<{ weight: number }>();
    total += row?.weight ?? 0.5;
  }

  const avg = total / featureList.length;
  const base = baseScore(features.impact, features.risk, features.effect);
  return Math.max(0, Math.min(10, base + (avg - 0.5) * 10));
}
