import { For, Show, createSignal } from "solid-js";
import { useQuery, useQueryClient } from "@tanstack/solid-query";
import { AlertTriangle, CheckCircle, FlaskConical, Loader, ScrollText, Server, Sparkles, Rocket, X, Eye } from "lucide-solid";
import { fetchNudges, fetchQueue, shipCard, rejectCardAction, fetchWithTimeout, API_URL } from "../api";

const HEALTH_TIMEOUT = 5_000;

export default function StatusPanel() {
  const queryClient = useQueryClient();
  const queue = useQuery(() => ({ queryKey: ["queue"], queryFn: fetchQueue, retry: 1, staleTime: 30_000, gcTime: 300_000 }));
  const nudges = useQuery(() => ({ queryKey: ["nudges"], queryFn: fetchNudges, retry: 1, staleTime: 30_000, gcTime: 300_000 }));
  const health = useQuery(() => ({
    queryKey: ["health"],
    queryFn: async () => {
      const res = await fetchWithTimeout(`${API_URL}/health`, { credentials: "include" }, HEALTH_TIMEOUT);
      return res.ok;
    },
    retry: 1,
    refetchInterval: 30_000,
    staleTime: 30_000,
  }));
  const pending = () => queue.data?.filter((c) => c.status === "pending").length ?? 0;
  const [actionError, setActionError] = createSignal<string | null>(null);

  const runShip = async (id: string) => {
    setActionError(null);
    try {
      await shipCard(id);
      await queryClient.invalidateQueries({ queryKey: ["queue"] });
      await queryClient.invalidateQueries({ queryKey: ["cards"] });
      await queryClient.invalidateQueries({ queryKey: ["nudges"] });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : `Failed to ship ${id}`);
    }
  };

  const runReject = async (id: string) => {
    setActionError(null);
    try {
      await rejectCardAction(id);
      await queryClient.invalidateQueries({ queryKey: ["queue"] });
      await queryClient.invalidateQueries({ queryKey: ["cards"] });
      await queryClient.invalidateQueries({ queryKey: ["nudges"] });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : `Failed to reject ${id}`);
    }
  };

  return (
    <div class="mb-8 grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div class="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
            <ScrollText size={16} class="text-indigo-500" />
            Active Ship Queue
          </h2>
          <span class="text-xs text-gray-500 dark:text-zinc-400">{pending()} pending</span>
        </div>
        <Show when={actionError()}>
          <div class="rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-300 mb-3">
            {actionError()}
          </div>
        </Show>
        <div class="space-y-2">
          <Show when={queue.isLoading}>
            <div class="flex items-center justify-center py-6 text-gray-400 dark:text-zinc-500">
              <Loader size={20} class="animate-spin mr-2" />
              Loading queue…
            </div>
          </Show>
          <Show when={queue.isError}>
            <div class="rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-300">
              Failed to load queue
            </div>
          </Show>
          <For each={queue.data ?? []}>
            {(job) => (
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-gray-50 dark:bg-zinc-800 p-3 text-sm">
                <div class="min-w-0 flex-1">
                  <div class="font-medium text-gray-900 dark:text-zinc-100 truncate">{job.title}</div>
                  <div class="text-xs text-gray-500 dark:text-zinc-400">{job.repoFullName}</div>
                </div>
                <div class="flex items-center gap-2">
                  <StatusBadge status={job.status} />
                  <Show when={job.status === "pending" || job.status === "approved"}>
                    <button
                      onClick={() => runShip(job.id)}
                      class="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/40"
                      title="Ship now"
                    >
                      <Rocket size={14} />
                    </button>
                    <button
                      onClick={() => runReject(job.id)}
                      class="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/40"
                      title="Reject now"
                    >
                      <X size={14} />
                    </button>
                  </Show>
                  <a
                    href={`/dashboard/cards?detail=${job.id}`}
                    class="p-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-700"
                    title="View card"
                  >
                    <Eye size={14} />
                  </a>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      <div class="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
            <Server size={16} class={health.data ? "text-emerald-500" : health.isError ? "text-rose-500" : "text-amber-500"} />
            Worker Health
          </h2>
          <span
            class={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              health.data ? "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20" : health.isError ? "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-900/20" : "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20"
            }`}
          >
            {health.isError ? <AlertTriangle size={12} /> : health.data ? <CheckCircle size={12} /> : <Loader size={12} class="animate-spin" />}
            {health.isError ? "Error" : health.data ? "Healthy" : "Checking"}
          </span>
        </div>
        <Show when={health.isLoading}>
          <div class="flex items-center justify-center py-6 text-gray-400 dark:text-zinc-500">
            <Loader size={20} class="animate-spin mr-2" />
            Checking health…
          </div>
        </Show>
        <Show when={health.isError}>
          <div class="rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-300">
            Failed to check worker health.
          </div>
        </Show>
        <Show when={!health.isLoading && !health.isError}>
          <div class={`rounded-xl border p-3 mb-3 text-sm ${health.data ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300" : "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 text-amber-800 dark:text-amber-300"}`}>
            {health.data ? "All systems operational." : "Health check failed or incomplete."}
          </div>
        </Show>
        <div class="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
          <div class="text-xs text-gray-500 dark:text-zinc-400 mb-2">Smart queue</div>
          <div class="flex items-center gap-2 text-sm text-gray-700 dark:text-zinc-200">
            <Sparkles size={14} class="text-indigo-500" />
            Recommended from history
          </div>
        </div>
      </div>

      <div class="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
            <FlaskConical size={16} class="text-indigo-500" />
            Nudges & Inspector
          </h2>
          <Show when={!nudges.isLoading && !nudges.isError}>
            <span class="text-xs text-gray-500 dark:text-zinc-400">{nudges.data?.length ?? 0} recommended</span>
          </Show>
        </div>
        <Show when={nudges.isLoading}>
          <div class="flex items-center justify-center py-6 text-gray-400 dark:text-zinc-500">
            <Loader size={20} class="animate-spin mr-2" />
            Loading nudges…
          </div>
        </Show>
        <Show when={nudges.isError}>
          <div class="rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-300">
            Failed to load nudges.
          </div>
        </Show>
        <Show when={!nudges.isLoading && !nudges.isError}>
          <div class="mb-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-3 text-sm text-indigo-800 dark:text-indigo-300">
            <div class="flex items-center gap-2 font-medium">
              <Sparkles size={14} />
              {nudges.data && nudges.data.length > 0 ? `${nudges.data.length} cards recommended` : "No recommendations yet"}
            </div>
            <div class="text-xs text-indigo-600 dark:text-indigo-400 mt-1">Capture a page and create a card from the inspector.</div>
          </div>
          <div class="flex gap-2 mb-3">
            <a href="/dashboard/inspector" class="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-xs font-medium text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800">Open inspector</a>
            <a href="/dashboard/inspector" class="px-3 py-1.5 rounded-lg bg-indigo-600 text-xs font-medium text-white hover:bg-indigo-700">New capture</a>
          </div>
        </Show>
      </div>
    </div>
  );
}

function StatusBadge(props: { status: import("@ship-feed/shared").ShipCard["status"] }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
    approved: "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300",
    rejected: "bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300",
    shipped: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300",
  };
  return (
    <span class={`px-2 py-1 rounded-full text-xs font-medium ${colors[props.status] ?? colors.pending}`}>
      {props.status}
    </span>
  );
}
