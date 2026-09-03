import type { ShipCard, CardKind, CardStatus, Impact, Risk, Effect, Phase } from "./card.types";
import {
  assertString,
  assertNumber,
  assertOptionalString,
  assertOptionalNumber,
  assertEnumValue,
  isStringArray,
} from "./validate";

const CARD_KINDS: readonly CardKind[] = ["idea", "work", "merge", "release"];
const CARD_STATUSES: readonly CardStatus[] = ["pending", "approved", "rejected", "shipped"];
const IMPACTS: readonly Impact[] = ["high", "medium", "low"];
const RISKS: readonly Risk[] = ["high", "medium", "low"];
const EFFECTS: readonly Effect[] = ["high", "medium", "low"];
const PHASES: readonly Phase[] = ["mvp", "v2", "done"];

function parseEvidenceIds(raw: unknown): string[] {
  if (raw === null || raw === undefined || raw === "") return [];
  const text = typeof raw === "string" ? raw : assertString(raw, "evidence_ids");
  try {
    const parsed = JSON.parse(text);
    if (isStringArray(parsed)) return parsed;
  } catch {
    // ignore malformed JSON
  }
  return [];
}

export function rowToCard(row: Record<string, unknown>): ShipCard {
  return {
    id: assertString(row.id, "id"),
    kind: assertEnumValue(row.kind, CARD_KINDS, "kind"),
    title: assertString(row.title, "title"),
    description: assertOptionalString(row.description, "description") ?? "",
    status: assertEnumValue(row.status, CARD_STATUSES, "status"),
    repoFullName: assertString(row.repo_full_name, "repo_full_name"),
    issueNumber: assertOptionalNumber(row.issue_number, "issue_number"),
    pullNumber: assertOptionalNumber(row.pull_number, "pull_number"),
    impact: assertEnumValue(row.impact, IMPACTS, "impact"),
    risk: assertEnumValue(row.risk, RISKS, "risk"),
    effect: assertEnumValue(row.effect, EFFECTS, "effect"),
    phase: assertEnumValue(row.phase, PHASES, "phase"),
    score: assertNumber(row.score, "score"),
    evidenceIds: parseEvidenceIds(row.evidence_ids),
    creatorId: assertOptionalString(row.creator_id, "creator_id"),
    createdAt: assertString(row.created_at, "created_at"),
    updatedAt: assertString(row.updated_at, "updated_at"),
  };
}
