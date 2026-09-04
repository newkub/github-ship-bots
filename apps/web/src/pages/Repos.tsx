import { For, Show, createResource } from "solid-js";
import { GitBranch, ExternalLink } from "lucide-solid";
import { fetchRepos } from "../api";

const GITHUB_APP_INSTALL_URL = import.meta.env.VITE_GITHUB_APP_INSTALL_URL;

export default function Repos() {
  const [repos] = createResource(fetchRepos);

  return (
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Repositories</h1>
      <p class="text-sm text-gray-500 dark:text-zinc-400 mb-6">Manage connected repositories and access.</p>

      <Show when={!repos.loading && !repos.error}>
        <Show when={repos() && repos()!.length > 0} fallback={
          <div class="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 shadow-sm text-center">
            <GitBranch class="mx-auto mb-3 text-gray-400" size={32} />
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">No repositories yet</h2>
            <p class="text-sm text-gray-500 dark:text-zinc-400 mb-4">Install the GitHub App to start shipping with ship-feed.</p>
            <a
              href={GITHUB_APP_INSTALL_URL}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              <ExternalLink size={16} />
              Install GitHub App
            </a>
          </div>
        }>
          <div class="grid gap-3">
            <For each={repos()}>
              {(repo) => (
                <div class="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 shadow-sm flex items-center justify-between">
                  <span class="font-medium text-gray-900 dark:text-white">{repo}</span>
                  <a
                    href={`https://github.com/${repo}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    View on GitHub
                  </a>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}
