import { fetchExternal, assertRecord, assertString, assertNumber, assertOptionalBoolean, assertOptionalString } from "@ship-feed/shared";
import { importRsaPrivateKey, signJwt } from "../crypto";

const REPO_FULL_NAME_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

export function parseRepo(repoFullName: string): { owner: string; repo: string } | undefined {
  if (!REPO_FULL_NAME_RE.test(repoFullName)) return undefined;
  const [owner, repo] = repoFullName.split("/");
  if (!owner || !repo || owner.includes("/") || repo.includes("/")) return undefined;
  return { owner, repo };
}

export function encodeRepoPath(owner: string, repo: string): string {
  return `${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
}

export interface ShipActionContext {
  appId: string;
  privateKey: string;
  githubApiUrl: string;
  githubWebUrl: string;
  correlationId: string;
  repoFullName: string;
  issueNumber?: number;
  pullNumber?: number;
  action: "approve" | "reject";
  reason?: string;
}

async function createJwt(appId: string, privateKey: string): Promise<string> {
  const header = JSON.stringify({ alg: "RS256", typ: "JWT" });
  const now = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify({ iat: now - 60, exp: now + 600, iss: appId });
  const key = await importRsaPrivateKey(privateKey);
  return signJwt(header, payload, key);
}

export async function githubFetch(ctx: ShipActionContext, path: string, token: string, init?: RequestInit): Promise<unknown> {
  const method = init?.method || "GET";
  const res = await fetchExternal("github", path, ctx.correlationId, `${ctx.githubApiUrl}${path}`, {
    ...init,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "x-github-api-version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${text}`);
  }
  if (res.status === 204) return undefined;
  return res.json();
}

export async function checkPullRequestMergeable(ctx: ShipActionContext, token: string): Promise<{ ok: boolean; message?: string }> {
  const parsed = parseRepo(ctx.repoFullName);
  if (!parsed) return { ok: false, message: "Invalid repoFullName" };
  const { owner, repo } = parsed;

  const json = await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/pulls/${ctx.pullNumber}`, token);
  if (!json) return { ok: false, message: "Pull request not found" };

  const pr = assertRecord(json, "GitHub pull request");
  const merged = assertOptionalBoolean(pr.merged, "merged");
  if (merged) return { ok: true, message: "Already merged" };

  const mergeable = assertOptionalBoolean(pr.mergeable, "mergeable");
  if (mergeable !== true) {
    return { ok: false, message: "Pull request is not mergeable" };
  }

  const mergeableState = assertOptionalString(pr.mergeable_state, "mergeable_state");
  if (mergeableState !== "clean") {
    return { ok: false, message: `Pull request mergeable_state is ${mergeableState ?? "unknown"}` };
  }

  return { ok: true };
}

export async function getInstallationToken(ctx: ShipActionContext): Promise<string | undefined> {
  const parsed = parseRepo(ctx.repoFullName);
  if (!parsed) return undefined;
  const { owner, repo } = parsed;

  const jwt = await createJwt(ctx.appId, ctx.privateKey);

  const installationJson = await githubFetch(ctx, `/repos/${encodeRepoPath(owner, repo)}/installation`, jwt);
  if (!installationJson) return undefined;
  const installation = assertRecord(installationJson, "GitHub installation");
  const installationId = assertNumber(installation.id, "installation.id");

  const tokenRespJson = await githubFetch(ctx, `/app/installations/${installationId}/access_tokens`, jwt, {
    method: "POST",
  });
  if (!tokenRespJson) return undefined;
  const tokenResp = assertRecord(tokenRespJson, "GitHub access token");
  return assertString(tokenResp.token, "token");
}
