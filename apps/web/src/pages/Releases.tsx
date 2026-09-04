import { Show, createResource, createSignal } from "solid-js";
import { FileText, Loader, AlertCircle } from "lucide-solid";
import { fetchReleaseNotes } from "../api";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";

function today() {
  return new Date().toISOString().split("T")[0]!;
}

function monthAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().split("T")[0]!;
}

export default function Releases() {
  const [from, setFrom] = createSignal(monthAgo());
  const [to, setTo] = createSignal(today());
  const [notes] = createResource(() => ({ from: from(), to: to() }), ({ from, to }) => fetchReleaseNotes(from, to));

  const copy = async () => {
    if (!notes()) return;
    await navigator.clipboard.writeText(notes()!.markdown);
  };

  return (
    <div>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Release Notes</h1>
          <p class="text-sm text-gray-500 dark:text-zinc-400 mt-1">Auto-draft notes from shipped cards.</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 mb-6">
        <label class="text-sm text-gray-600 dark:text-zinc-300">From</label>
        <input
          type="date"
          value={from()}
          onInput={(e) => setFrom(e.currentTarget.value)}
          class="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm dark:text-white"
        />
        <label class="text-sm text-gray-600 dark:text-zinc-300">To</label>
        <input
          type="date"
          value={to()}
          onInput={(e) => setTo(e.currentTarget.value)}
          class="rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm dark:text-white"
        />
      </div>

      <Show when={!notes.loading} fallback={
        <div class="space-y-4">
          <Skeleton class="h-10 w-1/2" />
          <Skeleton class="h-40 w-full" />
        </div>
      }>
        <Show when={notes.error}>
          <div class="rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 p-6 text-rose-700 dark:text-rose-300 flex items-start gap-3">
            <AlertCircle size={20} class="shrink-0 mt-0.5" />
            <div>
              <p class="font-medium">Failed to load release notes</p>
              <p class="text-sm mt-1">{(notes.error as Error).message}</p>
            </div>
          </div>
        </Show>

        <Show when={notes() && !notes.error}>
          <div class="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText size={18} />
                {notes()?.title}
              </h2>
              <button
                onClick={copy}
                class="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700"
              >
                Copy
              </button>
            </div>
            <pre class="whitespace-pre-wrap text-sm text-gray-700 dark:text-zinc-300 font-mono bg-gray-50 dark:bg-zinc-950 rounded-xl p-4 border border-gray-100 dark:border-zinc-800">
              {notes()?.markdown}
            </pre>
          </div>
        </Show>

        <Show when={notes() && notes()!.cards.length === 0}>
          <EmptyState icon={FileText} title="No shipped cards" description="No cards were shipped in the selected date range." />
        </Show>
      </Show>
    </div>
  );
}
