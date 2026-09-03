import { For, Show, createResource } from "solid-js";
import { Activity, AlertTriangle, CheckCircle, Loader, ScrollText, Server, Sparkles, Rocket, X, Eye } from "lucide-solid";
import type { ShipCard } from "@ship-feed/shared";
import { fetchQueue, shipCard, rejectCardAction, API_URL } from "../api";
export default function StatusPanel() {
  const [queue, { refetch }] = createResource(fetchQueue);
  const [health] = createResource(async () => {
    const res = await fetch(`${API_URL}/health`, { credentials: "include" });
    return res.ok;
  });
  const pending = () => queue()?.filter((c) => c.status === "pending").length ?? 0;
  const runShip = async (id: string) => {
    await shipCard(id).catch(() => {});
    await refetch();
  };
  const runReject = async (id: string) => {
    await rejectCardAction(id).catch(() => {});
    await refetch();
  };
  return (
    <div class="mb-8 grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div class="rounded-2xl bg-white border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <ScrollText size={16} class="text-indigo-500" />
            Active Ship Queue
          </h2>
          <span class="text-xs text-gray-500">{pending()} pending review</span>
        </div>
        <div class="space-y-2">
          <Show when={queue.loading}>
            <div class="flex items-center justify-center py-6 text-gray-400">
              <Loader size={20} class="animate-spin mr-2" />
              Loading queue...
            </div>
          </Show>
          <Show when={queue.error}>
            <div class="rounded-xl bg-rose-50 border border-rose-100 p-3 text-sm text-rose-700">
              Failed to load queue
            </div>
          </Show>
          <For each={queue() ?? []}>
            {(job) => (
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-gray-50 p-3 text-sm">
                <div class="min-w-0 flex-1">
                  <div class="font-medium text-gray-900 truncate">{job.title}</div>
                  <div class="text-xs text-gray-500">{job.repoFullName}</div>
                </div>
                <div class="flex items-center gap-2">
                  <StatusBadge status={job.status} />
                  <Show when={job.status === "pending" || job.status === "approved"}>
                    <button
                      onClick={() => runShip(job.id)}
                      class="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      title="Ship now"
                    >
                      <Rocket size={14} />
                    </button>
                    <button
                      onClick={() => runReject(job.id)}
                      class="p-1.5 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200"
                      title="Reject now"
                    >
                      <X size={14} />
                    </button>
                  </Show>
                  <a
                    href={`/dashboard/cards?detail=${job.id}`}
                    class="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
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
      <div class="rounded-2xl bg-white border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Server size={16} class={health() ? "text-emerald-500" : health.error ? "text-rose-500" : "text-amber-500"} />
            Worker Health
          </h2>
          <span
            class={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
              health() ? "text-emerald-700 bg-emerald-50" : health.error ? "text-rose-700 bg-rose-50" : "text-amber-700 bg-amber-50"
            }`}
          >
            {health.error ? <AlertTriangle size={12} /> : health() ? <CheckCircle size={12} /> : <Loader size={12} class="animate-spin" />}
            {health.error ? "Error" : health() ? "Healthy" : "Checking"}
          </span>
        </div>
        <Show when={health.loading}>
          <div class="flex items-center justify-center py-6 text-gray-400">
            <Loader size={20} class="animate-spin mr-2" />
            Checking health...
          </div>
        </Show>
        <Show when={health.error}>
          <div class="rounded-xl bg-rose-50 border border-rose-100 p-3 text-sm text-rose-700">
            Failed to check worker health.
          </div>
        </Show>
        <Show when={!health.loading && !health.error}>
          <div class={`rounded-xl border p-3 mb-3 text-sm ${health() ? "bg-emerald-50 border-emerald-100 text-emerald-800" : "bg-amber-50 border-amber-100 text-amber-800"}`}>
            {health() ? "All systems operational." : "Health check failed or incomplete."}
          </div>
        </Show>
        <div class="flex gap-2">
          <a href="/dashboard/settings" class="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50">View logs</a>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-100">
          <div class="text-xs text-gray-500 mb-1">Sort</div>
          <div class="flex items-center gap-2 text-sm text-gray-700">
            <Sparkles size={14} class="text-indigo-500" />
            Recommended from history
            <span class="text-xs text-gray-400" title="Card order tuned by learning loop">?</span>
          </div>
        </div>
      </div>
      <div class="rounded-2xl bg-white border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Activity size={16} class="text-emerald-500" />
            Test & Rollback
          </h2>
        </div>
        <div class="mb-4 rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-800">
          <div class="flex items-center gap-2 font-medium">
            <CheckCircle size={14} />
            Tests ready
          </div>
          <div class="text-xs text-emerald-600 mt-1">Run the oracle from the inspector page</div>
        </div>
        <div class="flex gap-2 mb-3">
          <a href="/dashboard/inspector" class="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50">View report</a>
          <a href="/dashboard/inspector" class="px-3 py-1.5 rounded-lg bg-indigo-600 text-xs font-medium text-white hover:bg-indigo-700">Run now</a>
        </div>
      </div>
    </div>
  );
}
function StatusBadge(props: { status: ShipCard["status"] }) {
  const colors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
    shipped: "bg-indigo-100 text-indigo-700",
  };
  return (
    <span class={`px-2 py-1 rounded-full text-xs font-medium ${colors[props.status] ?? colors.pending}`}>
      {props.status}
    </span>
  );
}
