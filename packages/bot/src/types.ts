import type { Octokit } from "@octokit/rest";
import type { D1Database } from "@cloudflare/workers-types";

export interface BotEnv {
  APP_ID: string;
  PRIVATE_KEY: string;
  WEBHOOK_SECRET: string;
  API_URL?: string;
  API_TOKEN?: string;
  DB?: D1Database;
  OPENAI_API_KEY?: string;
}

export function createBotEnv(overrides?: Partial<BotEnv>): BotEnv {
  return {
    APP_ID: "",
    PRIVATE_KEY: "",
    WEBHOOK_SECRET: "",
    ...overrides,
  };
}

export interface Repository {
  owner: { login: string };
  name: string;
}

export interface Issue {
  number: number;
  title: string;
  body?: string | null;
}

export interface PullRequest {
  number: number;
  title: string;
  body?: string | null;
}

export interface IssueOpenedPayload {
  repository: Repository;
  issue: Issue;
}

export interface IssueCommentPayload {
  repository: Repository;
  issue: Issue & { pull_request?: { url: string } | null };
  comment: { body: string; user?: { login: string } | null };
}

export interface PullRequestOpenedPayload {
  repository: Repository;
  pull_request: PullRequest;
}

export interface ShipFeedContext<T = unknown> {
  octokit: Octokit;
  payload: T;
}

export type ShipFeedHandler<T = unknown> = (ctx: ShipFeedContext<T>) => Promise<void>;

export interface ShipFeedWebhooks {
  on: <T = unknown>(event: string | string[], handler: ShipFeedHandler<T>) => void;
}
