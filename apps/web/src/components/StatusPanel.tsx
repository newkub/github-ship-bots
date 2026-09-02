import { For, Show } from "solid-js";
import { Activity, AlertTriangle, CheckCircle, RefreshCw, ScrollText, Server, Sparkles } from "lucide-solid";
import type { ShipCard } from "@ship-feed/shared";

interface StatusPanelProps {
  cards: ShipCard[];
}

const mockQueue: { id: string; repo: string; title: string; status: string }[] = [
  { id: "42", repo: "github-ship-bots", title: "refactor auth flow", status: "testing" },
  { id: "43", repo: "devin-skills", title: "update landing copy", status: "approved" },
];

const rollback = { version: "v1.2.0", timestamp: "2 minutes ago", reason: "deploy health check failed" };

export default function StatusPanel(props: StatusPanelProps) {
  const pending = () => props.cards.filter((c) => c.status === "pending").length;

  return (
    <div class="mb-8 grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div class="rounded-2xl bg-white border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <ScrollText size={16} class="text-indigo-500" />
            Active Ship Queue (3)
          </h2>
          <span class="text-xs text-gray-500">{pending()} pending review</span>
        </div>
        <div class="space-y-2">
          <For each={mockQueue}>
            {(job) => (
              <div class="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-sm">
                <div class="min-w-0">
                  <div class="font-medium text-gray-900 truncate">{job.title}</div>
                  <div class="text-xs text-gray-500">{job.repo}</div>
                </div>
                <StatusBadge status={job.status} />
              </div>
            )}
          </For>
        </div>
      </div>

      <div class="rounded-2xl bg-white border border-gray-200 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Server size={16} class="text-amber-500" />
            Worker Health
          </h2>
          <span class="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
            <AlertTriangle size={12} />
            Degraded
          </span>
        </div>
        <div class="rounded-xl bg-amber-50 border border-amber-100 p-3 mb-3 text-sm text-amber-800">
          Response time 820ms — above normal threshold.
        </div>
        <div class="flex gap-2">
          <button class="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50">View logs</button>
          <button class="px-3 py-1.5 rounded-lg bg-rose-600 text-xs font-medium text-white hover:bg-rose-700">Rollback now</button>
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
            12 tests generated
          </div>
          <div class="text-xs text-emerald-600 mt-1">From latest traffic capture</div>
        </div>
        <div class="flex gap-2 mb-3">
          <button class="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50">View report</button>
          <button class="px-3 py-1.5 rounded-lg bg-indigo-600 text-xs font-medium text-white hover:bg-indigo-700">Run now</button>
        </div>

        <Show when={rollback}>
          <div class="rounded-xl bg-rose-50 border border-rose-100 p-3 text-sm text-rose-800">
            <div class="flex items-center gap-2 font-medium">
              <RefreshCw size={14} />
              Auto-rolled back to {rollback.version}
            </div>
            <div class="text-xs text-rose-600 mt-1">{rollback.timestamp} — {rollback.reason}</div>
          </div>
        </Show>
      </div>
    </div>
  );
}

function StatusBadge(props: { status: string }) {
  const colors: Record<string, string> = {
    testing: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
    shipped: "bg-indigo-100 text-indigo-700",
  };
  return (
    <span class={`px-2 py-1 rounded-full text-xs font-medium ${colors[props.status] ?? colors.testing}`}>
      {props.status}
    </span>
  );
}
