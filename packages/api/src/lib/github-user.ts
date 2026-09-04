import { assertRecord } from "@ship-feed/shared";

export async function getGitHubLoginFromToken(token: string): Promise<string | undefined> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "x-github-api-version": "2022-11-28",
    },
  });
  if (!res.ok) {
    throw new Error(`GitHub user lookup failed: ${res.status}`);
  }
  const json = assertRecord(await res.json(), "GitHub user response");
  return json.login && typeof json.login === "string" ? json.login : undefined;
}
