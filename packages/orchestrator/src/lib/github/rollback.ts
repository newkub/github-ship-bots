import { getInstallationToken, githubFetch, parseRepo, encodeRepoPath, type ShipActionContext } from "./client";
import { getCorrelationId } from "@ship-feed/shared";

export interface RollbackResult {
  ok: boolean;
  skipped?: boolean;
  message?: string;
  pullNumber?: number;
}

function assertString(value: unknown, name: string): string {
  if (typeof value !== "string") throw new Error(`Expected ${name} to be a string`);
  return value;
}

function assertArray(value: unknown, name: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`Expected ${name} to be an array`);
  return value;
}

export async function monitorAndRollback(ctx: ShipActionContext): Promise<RollbackResult> {
  if (!ctx.appId || !ctx.privateKey) {
    return { ok: false, message: "GitHub App credentials not configured" };
  }
  if (!ctx.pullNumber) {
    return { skipped: true, ok: true, message: "No pull number to roll back" };
  }

  const parsed = parseRepo(ctx.repoFullName);
  if (!parsed) return { ok: false, message: "Invalid repoFullName" };
  const { owner, repo } = parsed;

  const token = await getInstallationToken(ctx);
  if (!token) return { ok: false, message: `GitHub App not installed on ${ctx.repoFullName}` };

  try {
    const prJson = await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/pulls/${ctx.pullNumber}`, token);
    const pr = prJson as Record<string, unknown>;
    const merged = pr.merged === true;
    const mergeCommitSha = assertString(pr.merge_commit_sha, "merge_commit_sha");
    const baseRef = assertString(pr.base_ref, "base_ref");

    if (!merged || !mergeCommitSha) {
      return { skipped: true, ok: true, message: "Pull request was not merged" };
    }

    const statusJson = await githubFetch(
      ctx,
      `/repos/${encodeRepoPath(owner, repo)}/commits/${mergeCommitSha}/status`,
      token
    );
    const status = (statusJson as Record<string, unknown>).state as string | undefined;
    if (status !== "failure" && status !== "error") {
      return { skipped: true, ok: true, message: `No failing checks after merge (state=${status ?? "unknown"})` };
    }

    const commitJson = await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/git/commits/${mergeCommitSha}`, token);
    const mergeCommit = commitJson as Record<string, unknown>;
    const parents = assertArray(mergeCommit.parents, "parents");
    if (parents.length < 2) {
      return { ok: false, message: "Merge commit does not have two parents" };
    }
    const firstParent = (parents[0] as Record<string, unknown>).sha as string;

    const baseRefJson = await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/git/ref/heads/${encodeURIComponent(baseRef)}`, token);
    const baseRefObj = baseRefJson as Record<string, unknown>;
    const baseSha = assertString((baseRefObj.object as Record<string, unknown>).sha, "base sha");

    const newCommit = await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/git/commits`, token, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: `Revert "Shipped via ship-feed: card ${ctx.pullNumber}"\n\nAuto-rollback triggered by failing status checks after merge.`,
        tree: firstParent,
        parents: [baseSha],
      }),
    }) as Record<string, unknown>;
    const newCommitSha = assertString(newCommit.sha, "new commit sha");

    const branchName = `ship-feed-revert-${ctx.pullNumber}`;
    await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/git/refs`, token, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: newCommitSha }),
    });

    const newPr = await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/pulls`, token, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: `Revert: ship-feed card #${ctx.pullNumber}`,
        head: branchName,
        base: baseRef,
        body: `Auto-rollback PR opened because status checks failed after merge.\n\nOriginal PR: #${ctx.pullNumber}`,
      }),
    }) as Record<string, unknown>;

    const pullNumber = typeof newPr.number === "number" ? newPr.number : undefined;
    return { ok: true, pullNumber, message: `Opened revert PR #${pullNumber ?? "?"}` };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message };
  }
}
