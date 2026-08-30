import type { Octokit } from "@octokit/rest";

export interface Repository {
  owner: { login: string };
  name: string;
}

export interface Issue {
  number: number;
  title: string;
}

export interface PullRequest {
  number: number;
  title: string;
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
