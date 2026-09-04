import { For, Show, createResource, createSignal } from "solid-js";
import { Scale, AlertCircle, Save, Loader } from "lucide-solid";
import { fetchRepos, fetchRule, setRule } from "../api";
import type { ApprovalRule } from "@ship-feed/shared";

export default function Rules() {
  const [repos] = createResource(fetchRepos);
  const [selected, setSelected] = createSignal<string>("");
  const [rule, { refetch }] = createResource(selected, fetchRule);
  const [saving, setSaving] = createSignal(false);
  const [message, setMessage] = createSignal<string | null>(null);

  const update = async (e: Event) => {
    e.preventDefault();
    if (!rule()) return;
    setSaving(true);
    setMessage(null);
    try {
      await setRule(rule()!);
      setMessage("Saved.");
      refetch();
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: keyof ApprovalRule, value: unknown) => {
    const current = rule();
    if (!current) return;
    ((current as unknown) as Record<string, unknown>)[key] = value;
  };

  return (
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Approval Rules</h1>
      <p class="text-sm text-gray-500 dark:text-zinc-400 mb-6">Configure quorum, vote weight, and veto for each repository.</p>

      <Show when={repos.loading}>
        <div class="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 shadow-sm mb-6 flex items-center gap-2 text-gray-500 dark:text-zinc-400">
          <Loader size={20} class="animate-spin" />
          Loading repositories…
        </div>
      </Show>

      <Show when={repos.error}>
        <div class="rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 p-4 text-rose-700 dark:text-rose-300 flex items-center gap-2 mb-4">
          <AlertCircle size={18} />
          {(repos.error as Error).message}
        </div>
      </Show>

      <Show when={!repos.loading && !repos.error}>
        <Show when={repos() && repos()!.length > 0} fallback={
          <div class="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 shadow-sm mb-6 text-gray-500 dark:text-zinc-400">
            No repositories found. Install the GitHub App to get started.
          </div>
        }>
          <div class="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 shadow-sm mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Repository</label>
            <select
              value={selected()}
              onChange={(e) => setSelected(e.currentTarget.value)}
              class="w-full sm:w-80 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm dark:text-white"
            >
              <option value="">Select repository</option>
              <For each={repos()}>{(repo) => <option value={repo}>{repo}</option>}</For>
            </select>
          </div>
        </Show>
      </Show>

      <Show when={rule()}>
        <form onSubmit={update} class="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Min approvers</label>
              <input
                type="number"
                min={1}
                value={rule()!.minApprovers}
                onInput={(e) => updateField("minApprovers", parseInt(e.currentTarget.value) || 1)}
                class="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Min rejectors</label>
              <input
                type="number"
                min={1}
                value={rule()!.minRejectors}
                onInput={(e) => updateField("minRejectors", parseInt(e.currentTarget.value) || 1)}
                class="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm dark:text-white"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Vote weight</label>
              <input
                type="number"
                min={1}
                value={rule()!.voteWeight}
                onInput={(e) => updateField("voteWeight", parseInt(e.currentTarget.value) || 1)}
                class="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm dark:text-white"
              />
            </div>
            <div class="flex items-center gap-2">
              <input
                id="veto"
                type="checkbox"
                checked={rule()!.vetoEnabled}
                onChange={(e) => updateField("vetoEnabled", e.currentTarget.checked)}
                class="w-4 h-4 rounded border-gray-300 text-indigo-600"
              />
              <label for="veto" class="text-sm text-gray-700 dark:text-zinc-300">Enable veto (one reject blocks ship)</label>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving()}
              class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save size={16} />
              {saving() ? "Saving…" : "Save rules"}
            </button>
            {message() && <span class="text-sm text-gray-600 dark:text-zinc-400">{message()}</span>}
          </div>
        </form>
      </Show>
    </div>
  );
}
