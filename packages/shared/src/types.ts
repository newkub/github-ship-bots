/**
 * Shared domain types for the ship-feed ecosystem.
 * Consumed by apps/mobile, apps/web, packages/bot, packages/api and packages/orchestrator.
 */

export type CardKind = "idea" | "work" | "merge" | "release";

export type CardStatus = "pending" | "approved" | "rejected" | "shipped";

export type Impact = "high" | "medium" | "low";
export type Risk = "high" | "medium" | "low";
export type Effect = "high" | "medium" | "low";
export type Phase = "mvp" | "v2" | "done";

export interface ShipCard {
  id: string;
  kind: CardKind;
  title: string;
  description: string;
  status: CardStatus;
  repoFullName: string;
  issueNumber?: number;
  pullNumber?: number;
  impact: Impact;
  risk: Risk;
  effect: Effect;
  phase: Phase;
  score: number;
  evidenceIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SwipeEvent {
  id: string;
  cardId: string;
  userId: string;
  direction: "approve" | "reject";
  createdAt: string;
}

export interface EvidenceRecord {
  id: string;
  cardId: string;
  kind: "image" | "video" | "log" | "diff";
  r2Key: string;
  sha256: string;
  ciRunUrl?: string;
  createdAt: string;
}

export interface TestOracleBaseline {
  id: string;
  repoFullName: string;
  name: string;
  r2Key: string;
  sha256: string;
  createdAt: string;
}

export interface TestOracleResult {
  id: string;
  baselineId: string;
  cardId: string;
  diffScore: number;
  passed: boolean;
  r2DiffKey?: string;
  createdAt: string;
}

export interface LearningWeight {
  repoFullName: string;
  feature: string;
  weight: number;
  updatedAt: string;
}

export type PlanTier = "free" | "pro" | "team";

export interface User {
  id: string;
  githubLogin: string;
  email?: string;
  workosUserId?: string;
  plan: PlanTier;
  stripeCustomerId?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  plan: PlanTier;
  status: "active" | "trialing" | "past_due" | "canceled";
  currentPeriodEnd: string;
}

export interface InspectorAnnotation {
  id: string;
  url: string;
  selector: string;
  prompt: string;
  screenshotR2Key?: string;
  cardId?: string;
  createdAt: string;
}

export interface Env {
  DB: D1Database;
  EVIDENCE_BUCKET: R2Bucket;
  BASELINE_BUCKET: R2Bucket;
  SESSION_KV: KVNamespace;
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
  WORKOS_API_KEY: string;
  WORKOS_CLIENT_ID: string;
  WORKOS_COOKIE_PASSWORD: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_PRICE_PRO: string;
  GITHUB_APP_ID: string;
  GITHUB_APP_PRIVATE_KEY: string;
  GITHUB_WEBHOOK_SECRET: string;
  PUBLIC_APP_URL: string;
  BOT_TOKEN?: string;
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
  VAPID_SUBJECT?: string;
  CRON_SECRET?: string;
  AUTO_APPROVE_THRESHOLD?: string;
  AUTO_APPROVE_RISK?: string;
  SLACK_WEBHOOK_URL?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}