import type { D1Database } from "@cloudflare/workers-types";
import type { ShipCard } from "@ship-feed/shared";
import { now } from "@ship-feed/shared";

type FeatureKey = { name: string; value: string };

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function getCardFeatures(card: ShipCard): FeatureKey[] {
  return [
    { name: "kind", value: card.kind },
    { name: "impact", value: card.impact },
    { name: "risk", value: card.risk },
    { name: "effect", value: card.effect },
    { name: "phase", value: card.phase },
  ];
}

export async function getFeatureWeight(
  db: D1Database,
  repoFullName: string,
  feature: string,
  value: string,
): Promise<number> {
  const row = await db
    .prepare("SELECT weight FROM learning_weights WHERE repo_full_name = ? AND feature = ?")
    .bind(repoFullName, `${feature}:${value}`)
    .first<{ weight: number }>();
  return row?.weight ?? 0.5;
}

export async function updateLearningWeights(
  db: D1Database,
  card: ShipCard,
  direction: "approve" | "reject",
): Promise<void> {
  const delta = direction === "approve" ? 0.05 : -0.05;
  const features = getCardFeatures(card);

  for (const f of features) {
    const current = await getFeatureWeight(db, card.repoFullName, f.name, f.value);
    const next = clamp01(current + delta);
    await db
      .prepare(
        "INSERT OR REPLACE INTO learning_weights (repo_full_name, feature, weight, updated_at) VALUES (?, ?, ?, ?)"
      )
      .bind(card.repoFullName, `${f.name}:${f.value}`, next, now())
      .run();
  }
}
