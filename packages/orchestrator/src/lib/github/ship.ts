import { getCorrelationId } from "@ship-feed/shared";
import { parseRepo, encodeRepoPath, getInstallationToken, githubFetch, checkPullRequestMergeable, type ShipActionContext } from "./client";

export interface GitHubActionResult {
  ok: boolean;
  skipped?: boolean;
  message?: string;
}

export async function shipToGitHub(ctx: ShipActionContext): Promise<GitHubActionResult> {
  if (!ctx.correlationId) {
    ctx.correlationId = getCorrelationId();
  }
  if (!ctx.appId || !ctx.privateKey) {
    return { ok: false, message: "GitHub App credentials not configured" };
  }

  const parsed = parseRepo(ctx.repoFullName);
  if (!parsed) {
    return { ok: false, message: "Invalid repoFullName" };
  }
  const { owner, repo } = parsed;

  const token = await getInstallationToken(ctx);
  if (!token) {
    return { ok: false, message: `GitHub App not installed on ${ctx.repoFullName}` };
  }

  try {
    if (ctx.pullNumber) {
      if (ctx.action === "approve") {
        const mergeCheck = await checkPullRequestMergeable(ctx, token);
        if (!mergeCheck.ok) {
          return { ok: false, message: mergeCheck.message };
        }
        if (mergeCheck.message === "Already merged") {
          return { ok: true, skipped: true, message: mergeCheck.message };
        }

        await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/pulls/${ctx.pullNumber}/merge`, token, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            commit_title: "Shipped via ship-feed: card",
            commit_message: "Approved and shipped automatically by ship-feed.",
            merge_method: "squash",
          }),
        });
        await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/issues/${ctx.pullNumber}/comments`, token, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ body: ":rocket: Shipped via ship-feed" }),
        });
      } else {
        await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/pulls/${ctx.pullNumber}`, token, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ state: "closed", state_reason: "not_planned" }),
        });
        await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/issues/${ctx.pullNumber}/comments`, token, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ body: `:x: Rejected via ship-feed${ctx.reason ? `: ${ctx.reason}` : ""}` }),
        });
      }
    } else if (ctx.issueNumber) {
      if (ctx.action === "approve") {
        await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/issues/${ctx.issueNumber}`, token, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ state: "closed" }),
        });
        await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/issues/${ctx.issueNumber}/comments`, token, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ body: ":rocket: Shipped via ship-feed" }),
        });
      } else {
        await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/issues/${ctx.issueNumber}`, token, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ state: "closed" }),
        });
        await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/issues/${ctx.issueNumber}/comments`, token, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ body: `:x: Rejected via ship-feed${ctx.reason ? `: ${ctx.reason}` : ""}` }),
        });
      }
    } else {
      return { ok: false, message: "No issueNumber or pullNumber to act on" };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message };
  }
}
