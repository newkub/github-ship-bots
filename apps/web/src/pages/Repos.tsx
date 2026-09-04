import { For, Show, createResource } from "solid-js";
import { GitPullRequest, Loader, AlertCircle, Plus } from "lucide-solid";
import { fetchRepos } from "../api";
import EmptyState from "../components/EmptyState";

const githubAppName = (import.meta.env.VITE_GITHUB_APP_NAME as string | undefined) || "wrikka-ship-bot";
const GITHUB_APP_INSTALL_URL = (import.meta.env.VITE_GITHUB_APP_INSTALL_URL as string | undefined) || `https://github.com/apps/${githubAppName}/installations/new`;

export default function Repos() {
  const [repos, { refetch }] = createResource(fetchRepos);

  return (
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Repositories</h1>
        <a
          href={GITHUB_APP_INSTALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          <Plus size={16} />
          Add repository
        </a>
      </div>

      <Show when={repos.loading}>
        <div class="flex items-center justify-center py-12 text-gray-500 dark:text-zinc-400">
          <Loader size={24} class="animate-spin mr-2" />
          Loading repositories…
        </div>
      </Show>

      <Show when={repos.error}>
        <div class="rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 p-6 text-rose-700 dark:text-rose-300">
          <div class="flex items-center gap-2 mb-2">
            <AlertCircle size={20} />
            <span class="font-medium">Failed to load repositories</span>
          </div>
          <button
            onClick={() => refetch()}
            class="text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </Show>

      <Show when={!repos.loading && !repos.error && (repos() ?? []).length === 0}>
        <EmptyState
          icon={GitPullRequest}
          title="No repositories yet"
          description="Install the GitHub App on the repositories you want ship-feed to watch."
          action={
            <a
              href={GITHUB_APP_INSTALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              <GitPullRequest size={18} />
              Install GitHub App
            </a>
          }
        />
      </Show>

      <div class="grid grid-cols-1 gap-3">
        <For each={repos() ?? []}>
          {(repo) => (
            <div class="flex items-center gap-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 hover:shadow-sm dark:hover:shadow-zinc-900/40 transition">
              <GitPullRequest size={20} class="text-gray-400 dark:text-zinc-500" />
              <span class="font-medium text-gray-900 dark:text-zinc-100">{repo}</span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
