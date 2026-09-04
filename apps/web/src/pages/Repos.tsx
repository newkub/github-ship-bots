import { For, Show, createResource } from "solid-js";
import { GitPullRequest, Loader, AlertCircle, Plus } from "lucide-solid";
import { fetchRepos } from "../api";

const GITHUB_APP_INSTALL_URL = (import.meta.env.VITE_GITHUB_APP_INSTALL_URL as string | undefined) || "https://github.com/apps/wrikka-ship-bot/installations/new";

export default function Repos() {
  const [repos, { refetch }] = createResource(fetchRepos);

  return (
    <div>
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Repositories</h1>
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
        <div class="flex items-center justify-center py-12 text-gray-500">
          <Loader size={24} class="animate-spin mr-2" />
          Loading repositories...
        </div>
      </Show>

      <Show when={repos.error}>
        <div class="rounded-2xl bg-rose-50 border border-rose-100 p-6 text-rose-700">
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
        <div class="rounded-2xl bg-gray-50 border border-gray-200 p-8 text-center">
          <p class="text-gray-600 mb-4">Install the GitHub App on repositories you want ship-feed to watch.</p>
          <a
            href={GITHUB_APP_INSTALL_URL}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            <GitPullRequest size={18} />
            Install GitHub App
          </a>
        </div>
      </Show>

      <div class="grid grid-cols-1 gap-3">
        <For each={repos() ?? []}>
          {(repo) => (
            <div class="flex items-center gap-3 rounded-xl bg-white border border-gray-200 p-4 hover:shadow-sm transition">
              <GitPullRequest size={20} class="text-gray-400" />
              <span class="font-medium text-gray-900">{repo}</span>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
