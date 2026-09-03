import type { ShipFeedWebhooks, ShipFeedHandler } from "../types";
import { getBotEnv } from "../lib/api";

function now() {
  return new Date().toISOString();
}

async function upsertUser(db: NonNullable<ReturnType<typeof getBotEnv>["DB"]>, githubLogin: string) {
  const existing = await db
    .prepare("SELECT id FROM users WHERE github_login = ?")
    .bind(githubLogin)
    .first<{ id: string }>();
  if (existing) return existing.id;

  const id = crypto.randomUUID();
  await db
    .prepare("INSERT INTO users (id, github_login, plan, created_at) VALUES (?, ?, ?, ?)")
    .bind(id, githubLogin, "free", now())
    .run();
  return id;
}

async function syncRepos(db: NonNullable<ReturnType<typeof getBotEnv>["DB"]>, userId: string, repos: { full_name: string }[]) {
  for (const repo of repos) {
    await db
      .prepare("INSERT OR IGNORE INTO user_repos (user_id, repo_full_name, created_at) VALUES (?, ?, ?)")
      .bind(userId, repo.full_name, now())
      .run();
  }
}

async function removeRepos(db: NonNullable<ReturnType<typeof getBotEnv>["DB"]>, repos: { full_name: string }[]) {
  for (const repo of repos) {
    await db
      .prepare("DELETE FROM user_repos WHERE repo_full_name = ?")
      .bind(repo.full_name)
      .run();
  }
}

export function installationHandler(webhooks: ShipFeedWebhooks) {
  const handleCreate: ShipFeedHandler<{
    installation: { account: { login: string } };
    repositories: { full_name: string }[];
  }> = async ({ payload }) => {
    const env = getBotEnv();
    if (!env.DB) return;

    const githubLogin = payload.installation.account.login;
    const userId = await upsertUser(env.DB, githubLogin);
    await syncRepos(env.DB, userId, payload.repositories ?? []);
  };

  const handleRepos: ShipFeedHandler<{
    installation: { account: { login: string } };
    repositories_added: { full_name: string }[];
    repositories_removed: { full_name: string }[];
  }> = async ({ payload }) => {
    const env = getBotEnv();
    if (!env.DB) return;

    const githubLogin = payload.installation.account.login;
    const userId = await upsertUser(env.DB, githubLogin);
    await syncRepos(env.DB, userId, payload.repositories_added ?? []);
    await removeRepos(env.DB, payload.repositories_removed ?? []);
  };

  webhooks.on("installation.created", handleCreate);
  webhooks.on("installation_repositories.added", handleRepos);
}
