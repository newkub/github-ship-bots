import { createSign } from "node:crypto";

export interface GitHubActionResult {
  ok: boolean;
  skipped?: boolean;
  message?: string;
}

export interface ShipActionContext {
  appId: string;
  privateKey: string;
  repoFullName: string;
  issueNumber?: number;
  pullNumber?: number;
  action: "approve" | "reject";
  reason?: string;
}

function base64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function createJwt(appId: string, privateKey: string): string {
  const header = JSON.stringify({ alg: "RS256", typ: "JWT" });
  const now = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify({ iat: now - 60, exp: now + 600, iss: appId });
  const signingInput = `${base64url(header)}.${base64url(payload)}`;
  const signature = createSign("RSA-SHA256").update(signingInput).sign(privateKey);
  return `${signingInput}.${base64url(signature)}`;
}

async function githubFetch(path: string, token: string, init?: RequestInit): Promise<unknown> {
  const res = await fetch(`https://api.github.com${path}`, {
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

async function getInstallationToken(ctx: ShipActionContext): Promise<string | undefined> {
  const [owner, repo] = ctx.repoFullName.split("/");
  if (!owner || !repo) return undefined;

  const jwt = createJwt(ctx.appId, ctx.privateKey);

  const installation = (await githubFetch(
    `/repos/${owner}/${repo}/installation`,
    jwt
  )) as { id: number } | undefined;
  if (!installation?.id) return undefined;

  const tokenResp = (await githubFetch(`/app/installations/${installation.id}/access_tokens`, jwt, {
    method: "POST",
  })) as { token: string } | undefined;
  return tokenResp?.token;
}

export async function shipToGitHub(ctx: ShipActionContext): Promise<GitHubActionResult> {
  if (!ctx.appId || !ctx.privateKey) {
    return { ok: true, skipped: true, message: "GitHub App credentials not configured" };
  }

  const [owner, repo] = ctx.repoFullName.split("/");
  if (!owner || !repo) {
    return { ok: true, skipped: true, message: "Invalid repoFullName" };
  }

  const token = await getInstallationToken(ctx);
  if (!token) {
    return { ok: true, skipped: true, message: `GitHub App not installed on ${ctx.repoFullName}` };
  }

  try {
    if (ctx.pullNumber) {
      if (ctx.action === "approve") {
        await githubFetch(`/repos/${owner}/${repo}/pulls/${ctx.pullNumber}/merge`, token, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            commit_title: `Shipped via ship-feed: card`,
            commit_message: `Approved and shipped automatically by ship-feed.`,
            merge_method: "squash",
          }),
        });
        await githubFetch(`/repos/${owner}/${repo}/issues/${ctx.pullNumber}/comments`, token, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ body: ":rocket: Shipped via ship-feed" }),
        });
      } else {
        await githubFetch(`/repos/${owner}/${repo}/pulls/${ctx.pullNumber}`, token, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ state: "closed", state_reason: "not_planned" }),
        });
        await githubFetch(`/repos/${owner}/${repo}/issues/${ctx.pullNumber}/comments`, token, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ body: `:x: Rejected via ship-feed${ctx.reason ? `: ${ctx.reason}` : ""}` }),
        });
      }
    } else if (ctx.issueNumber) {
      if (ctx.action === "approve") {
        await githubFetch(`/repos/${owner}/${repo}/issues/${ctx.issueNumber}`, token, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ state: "closed" }),
        });
        await githubFetch(`/repos/${owner}/${repo}/issues/${ctx.issueNumber}/comments`, token, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ body: ":rocket: Shipped via ship-feed" }),
        });
      } else {
        await githubFetch(`/repos/${owner}/${repo}/issues/${ctx.issueNumber}`, token, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ state: "closed" }),
        });
        await githubFetch(`/repos/${owner}/${repo}/issues/${ctx.issueNumber}/comments`, token, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ body: `:x: Rejected via ship-feed${ctx.reason ? `: ${ctx.reason}` : ""}` }),
        });
      }
    } else {
      return { ok: true, skipped: true, message: "No issueNumber or pullNumber to act on" };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, message };
  }
}
