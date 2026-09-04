import { getCorrelationId } from "@ship-feed/shared";
import { getInstallationToken, githubFetch, parseRepo, encodeRepoPath } from "./client";
import type { ShipCard } from "@ship-feed/shared";

export interface CommentContext {
  appId: string;
  privateKey: string;
  githubApiUrl: string;
  githubWebUrl: string;
  correlationId: string;
}

export async function postCommentToGitHub(
  ctx: CommentContext,
  card: Pick<ShipCard, "repoFullName" | "issueNumber" | "pullNumber">,
  body: string
): Promise<{ ok: boolean; message?: string }> {
  if (!ctx.appId || !ctx.privateKey) {
    return { ok: false, message: "GitHub App credentials not configured" };
  }

  const parsed = parseRepo(card.repoFullName);
  if (!parsed) {
    return { ok: false, message: "Invalid repoFullName" };
  }
  const { owner, repo } = parsed;

  const tokenCtx = {
    ...ctx,
    repoFullName: card.repoFullName,
    issueNumber: card.issueNumber,
    pullNumber: card.pullNumber,
    action: "approve" as const,
  };

  const token = await getInstallationToken(tokenCtx);
  if (!token) {
    return { ok: false, message: `GitHub App not installed on ${card.repoFullName}` };
  }

  const issueNumber = card.pullNumber ?? card.issueNumber;
  if (!issueNumber) {
    return { ok: false, message: "No issueNumber or pullNumber to comment on" };
  }

  try {
    await githubFetch(tokenCtx, `/repos/${encodeRepoPath(owner, repo)}/issues/${issueNumber}/comments`, token, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body }),
    });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message };
  }
}

export function createCommentContext(env: {
  GITHUB_APP_ID?: string;
  GITHUB_APP_PRIVATE_KEY?: string;
  GITHUB_API_URL?: string;
  GITHUB_WEB_URL?: string;
}): CommentContext {
  return {
    appId: env.GITHUB_APP_ID ?? "",
    privateKey: env.GITHUB_APP_PRIVATE_KEY ?? "",
    githubApiUrl: env.GITHUB_API_URL ?? "https://api.github.com",
    githubWebUrl: env.GITHUB_WEB_URL ?? "https://github.com",
    correlationId: getCorrelationId(),
  };
}
