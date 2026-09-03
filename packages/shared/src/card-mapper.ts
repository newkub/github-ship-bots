import type { ShipCard } from "./card.types";

function parseEvidenceIds(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((x): x is string => typeof x === "string");
    }
  } catch {
    // ignore malformed JSON
  }
  return [];
}

export function rowToCard(row: Record<string, unknown>): ShipCard {
  return {
    id: row.id as string,
    kind: row.kind as ShipCard["kind"],
    title: row.title as string,
    description: row.description as string,
    status: row.status as ShipCard["status"],
    repoFullName: row.repo_full_name as string,
    issueNumber: row.issue_number as number | undefined,
    pullNumber: row.pull_number as number | undefined,
    impact: row.impact as ShipCard["impact"],
    risk: row.risk as ShipCard["risk"],
    effect: row.effect as ShipCard["effect"],
    phase: row.phase as ShipCard["phase"],
    score: row.score as number,
    evidenceIds: parseEvidenceIds(row.evidence_ids as string),
    creatorId: (row.creator_id as string) || undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
