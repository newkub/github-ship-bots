import type { User, PlanTier } from "./user.types";
import type { ShipCard, CardComment, SwipeEvent, CardKind, CardStatus, Impact, Risk, Effect, Phase } from "./card.types";
import type { EvidenceRecord, TestOracleBaseline, TestOracleResult } from "./evidence.types";
import type { CommentTemplate } from "./template.types";
import type { LearningWeight, ApprovalRule } from "./learning.types";

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

export function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || value === null || isString(value);
}

export function isOptionalNumber(value: unknown): value is number | undefined {
  return value === undefined || value === null || isNumber(value);
}

export function isEnumValue<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return isString(value) && allowed.some((item) => item === value);
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function assertString(value: unknown, name: string): string {
  if (!isString(value)) throw new Error(`Expected ${name} to be a string`);
  return value;
}

export function assertNumber(value: unknown, name: string): number {
  if (!isNumber(value)) throw new Error(`Expected ${name} to be a number`);
  return value;
}

export function assertOptionalNumber(value: unknown, name: string): number | undefined {
  if (value === undefined || value === null) return undefined;
  if (!isNumber(value)) throw new Error(`Expected ${name} to be a number or null`);
  return value;
}

export function assertOptionalString(value: unknown, name: string): string | undefined {
  if (value === undefined || value === null) return undefined;
  return assertString(value, name);
}

export function assertEnumValue<T extends string>(value: unknown, allowed: readonly T[], name: string): T {
  if (!isEnumValue(value, allowed)) throw new Error(`Expected ${name} to be one of ${allowed.join(", ")}`);
  return value;
}

export function assertRecord(value: unknown, name: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Expected ${name} to be an object`);
  }
  return value as Record<string, unknown>;
}

export function assertBoolean(value: unknown, name: string): boolean {
  if (typeof value !== "boolean") throw new Error(`Expected ${name} to be a boolean`);
  return value;
}

export function assertOptionalBoolean(value: unknown, name: string): boolean | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "boolean") throw new Error(`Expected ${name} to be a boolean`);
  return value;
}

export function assertArray(value: unknown, name: string): unknown[] {
  if (!isArray(value)) throw new Error(`Expected ${name} to be an array`);
  return value;
}

export function assertStringArray(value: unknown, name: string): string[] {
  const arr = assertArray(value, name);
  return arr.map((item, i) => assertString(item, `${name}[${i}]`));
}

export function assertArrayOf<T>(value: unknown, itemValidator: (v: unknown, i: number) => T, name: string): T[] {
  const arr = assertArray(value, name);
  return arr.map((item, i) => itemValidator(item, i));
}

const PLAN_TIERS: readonly PlanTier[] = ["free", "pro", "team"];

export function assertUser(value: unknown): User {
  const record = assertRecord(value, "User");
  return {
    id: assertString(record.id, "id"),
    githubLogin: assertString(record.githubLogin, "githubLogin"),
    email: assertOptionalString(record.email, "email"),
    workosUserId: assertOptionalString(record.workosUserId, "workosUserId"),
    plan: assertEnumValue(record.plan, PLAN_TIERS, "plan"),
    stripeCustomerId: assertOptionalString(record.stripeCustomerId, "stripeCustomerId"),
    createdAt: assertString(record.createdAt, "createdAt"),
  };
}

const CARD_KINDS: readonly CardKind[] = ["idea", "work", "merge", "release"];
const CARD_STATUSES: readonly CardStatus[] = ["pending", "approved", "rejected", "shipped"];
const IMPACTS: readonly Impact[] = ["high", "medium", "low"];
const RISKS: readonly Risk[] = ["high", "medium", "low"];
const EFFECTS: readonly Effect[] = ["high", "medium", "low"];
const PHASES: readonly Phase[] = ["mvp", "v2", "done"];

export function assertShipCard(value: unknown): ShipCard {
  const record = assertRecord(value, "ShipCard");
  return {
    id: assertString(record.id, "id"),
    kind: assertEnumValue(record.kind, CARD_KINDS, "kind"),
    title: assertString(record.title, "title"),
    description: assertOptionalString(record.description, "description") ?? "",
    status: assertEnumValue(record.status, CARD_STATUSES, "status"),
    repoFullName: assertString(record.repoFullName, "repoFullName"),
    issueNumber: assertOptionalNumber(record.issueNumber, "issueNumber"),
    pullNumber: assertOptionalNumber(record.pullNumber, "pullNumber"),
    impact: assertEnumValue(record.impact, IMPACTS, "impact"),
    risk: assertEnumValue(record.risk, RISKS, "risk"),
    effect: assertEnumValue(record.effect, EFFECTS, "effect"),
    phase: assertEnumValue(record.phase, PHASES, "phase"),
    score: assertNumber(record.score, "score"),
    evidenceIds: isArray(record.evidenceIds) ? assertStringArray(record.evidenceIds, "evidenceIds") : [],
    creatorId: assertOptionalString(record.creatorId, "creatorId"),
    createdAt: assertString(record.createdAt, "createdAt"),
    updatedAt: assertString(record.updatedAt, "updatedAt"),
  };
}

export function assertShipCardArray(value: unknown): ShipCard[] {
  return assertArrayOf(value, assertShipCard, "ShipCard[]");
}

export function assertCardComment(value: unknown): CardComment {
  const record = assertRecord(value, "CardComment");
  return {
    id: assertString(record.id, "id"),
    cardId: assertString(record.cardId, "cardId"),
    userId: assertOptionalString(record.userId, "userId"),
    swipeId: assertOptionalString(record.swipeId, "swipeId"),
    templateId: assertOptionalString(record.templateId, "templateId"),
    body: assertString(record.body, "body"),
    user: assertOptionalString(record.user, "user"),
    postedToGitHub: assertBoolean(record.postedToGitHub, "postedToGitHub"),
    createdAt: assertString(record.createdAt, "createdAt"),
  };
}

export function assertCardCommentArray(value: unknown): CardComment[] {
  return assertArrayOf(value, assertCardComment, "CardComment[]");
}

const EVIDENCE_KINDS: readonly EvidenceRecord["kind"][] = ["image", "video", "log", "diff"];

export function assertEvidenceRecord(value: unknown): EvidenceRecord {
  const record = assertRecord(value, "EvidenceRecord");
  return {
    id: assertString(record.id, "id"),
    cardId: assertOptionalString(record.cardId, "cardId"),
    kind: assertEnumValue(record.kind, EVIDENCE_KINDS, "kind"),
    r2Key: assertString(record.r2Key, "r2Key"),
    sha256: assertString(record.sha256, "sha256"),
    ciRunUrl: assertOptionalString(record.ciRunUrl, "ciRunUrl"),
    createdAt: assertString(record.createdAt, "createdAt"),
  };
}

export function assertEvidenceRecordArray(value: unknown): EvidenceRecord[] {
  return assertArrayOf(value, assertEvidenceRecord, "EvidenceRecord[]");
}

export function assertCommentTemplate(value: unknown): CommentTemplate {
  const record = assertRecord(value, "CommentTemplate");
  return {
    id: assertString(record.id, "id"),
    userId: assertString(record.userId, "userId"),
    repoFullName: assertOptionalString(record.repoFullName, "repoFullName"),
    name: assertString(record.name, "name"),
    body: assertString(record.body, "body"),
    createdAt: assertString(record.createdAt, "createdAt"),
  };
}

export function assertCommentTemplateArray(value: unknown): CommentTemplate[] {
  return assertArrayOf(value, assertCommentTemplate, "CommentTemplate[]");
}

export function assertApprovalRule(value: unknown): ApprovalRule {
  const record = assertRecord(value, "ApprovalRule");
  return {
    repoFullName: assertString(record.repoFullName, "repoFullName"),
    minApprovers: assertNumber(record.minApprovers, "minApprovers"),
    minRejectors: assertNumber(record.minRejectors, "minRejectors"),
    voteWeight: assertNumber(record.voteWeight, "voteWeight"),
    vetoEnabled: assertBoolean(record.vetoEnabled, "vetoEnabled"),
    updatedAt: assertString(record.updatedAt, "updatedAt"),
  };
}

export function assertLearningWeight(value: unknown): LearningWeight {
  const record = assertRecord(value, "LearningWeight");
  return {
    repoFullName: assertString(record.repoFullName, "repoFullName"),
    feature: assertString(record.feature, "feature"),
    weight: assertNumber(record.weight, "weight"),
    updatedAt: assertString(record.updatedAt, "updatedAt"),
  };
}

export function assertTestOracleBaseline(value: unknown): TestOracleBaseline {
  const record = assertRecord(value, "TestOracleBaseline");
  return {
    id: assertString(record.id, "id"),
    repoFullName: assertString(record.repoFullName, "repoFullName"),
    name: assertString(record.name, "name"),
    r2Key: assertString(record.r2Key, "r2Key"),
    sha256: assertString(record.sha256, "sha256"),
    createdAt: assertString(record.createdAt, "createdAt"),
  };
}

export function assertTestOracleResult(value: unknown): TestOracleResult {
  const record = assertRecord(value, "TestOracleResult");
  return {
    id: assertString(record.id, "id"),
    baselineId: assertString(record.baselineId, "baselineId"),
    cardId: assertString(record.cardId, "cardId"),
    diffScore: assertNumber(record.diffScore, "diffScore"),
    passed: assertBoolean(record.passed, "passed"),
    r2DiffKey: assertOptionalString(record.r2DiffKey, "r2DiffKey"),
    createdAt: assertString(record.createdAt, "createdAt"),
  };
}

export function assertRepoList(value: unknown): string[] {
  return assertStringArray(value, "repoList");
}

export function assertVotes(value: unknown): { minApprovers: number; minRejectors: number; voteWeight: number; vetoEnabled: boolean; votes: { direction: string; user: string }[] } {
  const record = assertRecord(value, "votes");
  const votes = assertArray(record.votes, "votes");
  return {
    minApprovers: assertNumber(record.minApprovers, "minApprovers"),
    minRejectors: assertNumber(record.minRejectors, "minRejectors"),
    voteWeight: assertNumber(record.voteWeight, "voteWeight"),
    vetoEnabled: assertBoolean(record.vetoEnabled, "vetoEnabled"),
    votes: votes.map((v, i) => {
      const item = assertRecord(v, `votes[${i}]`);
      return {
        direction: assertString(item.direction, `votes[${i}].direction`),
        user: assertString(item.user, `votes[${i}].user`),
      };
    }),
  };
}

export function assertExplain(value: unknown): { base: number; averageWeight: number; adjustment: number; final: number; features: { feature: string; value: string; weight: number; defaultWeight: number; adjustment: number }[] } {
  const record = assertRecord(value, "explain");
  const features = assertArray(record.features, "features");
  return {
    base: assertNumber(record.base, "base"),
    averageWeight: assertNumber(record.averageWeight, "averageWeight"),
    adjustment: assertNumber(record.adjustment, "adjustment"),
    final: assertNumber(record.final, "final"),
    features: features.map((f, i) => {
      const item = assertRecord(f, `features[${i}]`);
      return {
        feature: assertString(item.feature, `features[${i}].feature`),
        value: assertString(item.value, `features[${i}].value`),
        weight: assertNumber(item.weight, `features[${i}].weight`),
        defaultWeight: assertNumber(item.defaultWeight, `features[${i}].defaultWeight`),
        adjustment: assertNumber(item.adjustment, `features[${i}].adjustment`),
      };
    }),
  };
}

export function assertPlan(value: unknown): { id: string; name: string; price: string; features: string[] } {
  const record = assertRecord(value, "plan");
  return {
    id: assertString(record.id, "id"),
    name: assertString(record.name, "name"),
    price: assertString(record.price, "price"),
    features: assertStringArray(record.features, "features"),
  };
}

export function assertPlanList(value: unknown): { id: string; name: string; price: string; features: string[] }[] {
  return assertArrayOf(value, assertPlan, "planList");
}

export function assertCheckout(value: unknown): { url: string } {
  const record = assertRecord(value, "checkout");
  return { url: assertString(record.url, "url") };
}

export function assertReleaseNotes(value: unknown): { title: string; markdown: string; cards: { id: string; title: string; repoFullName: string }[] } {
  const record = assertRecord(value, "releaseNotes");
  const cards = assertArray(record.cards, "cards");
  return {
    title: assertString(record.title, "title"),
    markdown: assertString(record.markdown, "markdown"),
    cards: cards.map((c, i) => {
      const item = assertRecord(c, `cards[${i}]`);
      return {
        id: assertString(item.id, `cards[${i}].id`),
        title: assertString(item.title, `cards[${i}].title`),
        repoFullName: assertString(item.repoFullName, `cards[${i}].repoFullName`),
      };
    }),
  };
}

export function assertShipConfig(value: unknown): { appUrl: string; githubAppName: string; autoApproveThreshold: number; autoApproveRisk: string } {
  const record = assertRecord(value, "shipConfig");
  return {
    appUrl: assertString(record.appUrl, "appUrl"),
    githubAppName: assertString(record.githubAppName, "githubAppName"),
    autoApproveThreshold: assertNumber(record.autoApproveThreshold, "autoApproveThreshold"),
    autoApproveRisk: assertString(record.autoApproveRisk, "autoApproveRisk"),
  };
}

export function assertSwipeEvent(value: unknown): SwipeEvent {
  const record = assertRecord(value, "SwipeEvent");
  return {
    id: assertString(record.id, "id"),
    cardId: assertString(record.cardId, "cardId"),
    userId: assertString(record.userId, "userId"),
    direction: assertEnumValue(record.direction, ["approve", "reject"] as const, "direction"),
    createdAt: assertString(record.createdAt, "createdAt"),
  };
}

export function assertOk(value: unknown): { ok: true } {
  const record = assertRecord(value, "ok");
  if (record.ok !== true) throw new Error("Expected ok to be true");
  return { ok: true };
}

export function assertOkStatus(value: unknown): { ok: true; status: string } {
  const record = assertRecord(value, "okStatus");
  if (record.ok !== true) throw new Error("Expected ok to be true");
  return { ok: true, status: assertString(record.status, "status") };
}

export function assertOkStatusUndone(value: unknown): { ok: true; status: string; undone: string } {
  const record = assertRecord(value, "okStatusUndone");
  if (record.ok !== true) throw new Error("Expected ok to be true");
  return {
    ok: true,
    status: assertString(record.status, "status"),
    undone: assertString(record.undone, "undone"),
  };
}

export function assertSession(value: unknown): { user?: User } {
  const record = assertRecord(value, "session");
  if (record.user === undefined || record.user === null) return {};
  return { user: assertUser(record.user) };
}

export function assertInspectorResult(value: unknown): { ok: true; id: string; card: ShipCard; message: string } {
  const record = assertRecord(value, "inspectorResult");
  if (record.ok !== true) throw new Error("Expected ok to be true");
  return {
    ok: true,
    id: assertString(record.id, "id"),
    card: assertShipCard(record.card),
    message: assertString(record.message, "message"),
  };
}
