import type { D1Database } from "@cloudflare/workers-types";
import type { ShipCard } from "@ship-feed/shared";

const impactMap = { high: 3, medium: 2, low: 1 };
const effectMap = { high: 3, medium: 2, low: 1 };
const riskMap = { high: -2, medium: -1, low: 0 };

export function baseScore(impact: ShipCard["impact"], risk: ShipCard["risk"], effect: ShipCard["effect"]) {
  return Math.max(0, (impactMap[impact] || 0) + (effectMap[effect] || 0) + (riskMap[risk] || 0));
}

interface FeatureContribution {
  feature: string;
  value: string;
  weight: number;
  defaultWeight: number;
  adjustment: number;
}

export interface ScoreExplanation {
  base: number;
  averageWeight: number;
  adjustment: number;
  final: number;
  features: FeatureContribution[];
}

export async function explainScore(
  db: D1Database,
  repoFullName: string,
  features: Pick<ShipCard, "kind" | "impact" | "risk" | "effect" | "phase">
): Promise<ScoreExplanation> {
  const featureList = [
    { name: "kind", value: features.kind },
    { name: "impact", value: features.impact },
    { name: "risk", value: features.risk },
    { name: "effect", value: features.effect },
    { name: "phase", value: features.phase },
  ];

  const contributions: FeatureContribution[] = [];
  let total = 0;
  for (const f of featureList) {
    const row = await db
      .prepare("SELECT weight FROM learning_weights WHERE repo_full_name = ? AND feature = ?")
      .bind(repoFullName, `${f.name}:${f.value}`)
      .first<{ weight: number }>();
    const weight = row?.weight ?? 0.5;
    total += weight;
    contributions.push({
      feature: f.name,
      value: f.value,
      weight,
      defaultWeight: 0.5,
      adjustment: Number((weight - 0.5).toFixed(3)),
    });
  }

  const averageWeight = total / featureList.length;
  const base = baseScore(features.impact, features.risk, features.effect);
  const adjustment = (averageWeight - 0.5) * 10;
  const final = Math.max(0, Math.min(10, base + adjustment));

  return {
    base,
    averageWeight: Number(averageWeight.toFixed(3)),
    adjustment: Number(adjustment.toFixed(3)),
    final: Number(final.toFixed(2)),
    features: contributions,
  };
}

export async function autoScore(
  db: D1Database,
  repoFullName: string,
  features: Pick<ShipCard, "kind" | "impact" | "risk" | "effect" | "phase">
): Promise<number> {
  const explanation = await explainScore(db, repoFullName, features);
  return explanation.final;
}
