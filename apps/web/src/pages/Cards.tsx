import { For, Show, createMemo, createSignal, onMount } from "solid-js";
import { useQuery, useQueryClient } from "@tanstack/solid-query";
import { useSearchParams } from "@solidjs/router";
import { Check, Clock, Grid3X3, List, Package, Rocket, X, GitBranch } from "lucide-solid";
import type { ShipCard, CardStatus } from "@ship-feed/shared";
import { fetchCards, fetchRepos, updateCardStatus } from "../api";
import CardDetail from "./CardDetail";
import CardTile from "../components/CardTile";
import EmptyState from "../components/EmptyState";
import Kanban from "../components/Kanban";
import Skeleton from "../components/Skeleton";
import StatusPanel from "../components/StatusPanel";

export default function Cards() {
  const queryClient = useQueryClient();
  const query = useQuery(() => ({ queryKey: ["cards"], queryFn: fetchCards }));
  const reposQuery = useQuery(() => ({ queryKey: ["repos"], queryFn: fetchRepos }));
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = createSignal<CardStatus | "all">("all");
  const [repoFilter, setRepoFilter] = createSignal<string>("all");
  const [view, setView] = createSignal<"list" | "board">("board");
  const [pendingId, setPendingId] = createSignal<string | null>(null);
  const [detailId, setDetailId] = createSignal<string | null>(null);

  onMount(() => {
    const id = searchParams.detail;
    if (id && typeof id === "string") setDetailId(id);
  });

  const onStatus = async (id: string, status: CardStatus) => {
    setPendingId(id);
    try {
      await updateCardStatus(id, status);
      await queryClient.invalidateQueries({ queryKey: ["cards"] });
    } finally {
      setPendingId(null);
    }
  };

  const cards = createMemo(() => {
    const data = query.data ?? [];
    const status = filter();
    const repo = repoFilter();
    return data.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (repo !== "all" && c.repoFullName !== repo) return false;
      return true;
    });
  });

  const counts = createMemo(() => {
    const data = query.data ?? [];
    const repo = repoFilter();
    const filtered = repo === "all" ? data : data.filter((c) => c.repoFullName === repo);
    return {
      total: filtered.length,
      pending: filtered.filter((c) => c.status === "pending").length,
      approved: filtered.filter((c) => c.status === "approved").length,
      rejected: filtered.filter((c) => c.status === "rejected").length,
      shipped: filtered.filter((c) => c.status === "shipped").length,
    };
  });

  return (
    <div>
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-sm text-gray-500 mt-1">Overview, queue, health, and actions for your ship loop.</p>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setView("board")}
                class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  view() === "board" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3X3 size={14} /> Board
              </button>
              <button
                onClick={() => setView("list")}
                class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  view() === "list" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List size={14} /> List
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <SummaryCard label="Pending" value={counts().pending} icon={Clock} color="gray" active={filter() === "pending"} onClick={() => setFilter("pending")} />
          <SummaryCard label="Approved" value={counts().approved} icon={Check} color="emerald" active={filter() === "approved"} onClick={() => setFilter("approved")} />
          <SummaryCard label="Rejected" value={counts().rejected} icon={X} color="rose" active={filter() === "rejected"} onClick={() => setFilter("rejected")} />
          <SummaryCard label="Shipped" value={counts().shipped} icon={Package} color="indigo" active={filter() === "shipped"} onClick={() => setFilter("shipped")} />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            class={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
              filter() === "all" ? "bg-indigo-600 text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            All ({counts().total})
          </button>
          <For each={["pending", "approved", "rejected", "shipped"] as const}>
            {(key) => (
              <button
                onClick={() => setFilter(key)}
                class={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  filter() === key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {key[0]!.toUpperCase() + key.slice(1)} ({counts()[key]})
              </button>
            )}
          </For>

          <Show when={!reposQuery.isLoading && reposQuery.data && reposQuery.data.length > 0}>
            <div class="h-5 w-px bg-gray-200 mx-1" />
            <GitBranch size={14} class="text-gray-400" />
            <For each={["all", ...reposQuery.data!]}>
              {(repo) => (
                <button
                  onClick={() => setRepoFilter(repo)}
                  class={`px-3 py-1.5 rounded-full text-xs font-medium transition truncate max-w-[12rem] ${
                    repoFilter() === repo
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {repo === "all" ? "All repos" : repo}
                </button>
              )}
            </For>
          </Show>
        </div>
      </div>

      <StatusPanel />

      <Show when={!query.isLoading} fallback={
        <div class="space-y-5">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Skeleton class="h-24 w-full" />
            <Skeleton class="h-24 w-full" />
            <Skeleton class="h-24 w-full" />
            <Skeleton class="h-24 w-full" />
          </div>
          <Skeleton class="h-40 w-full" />
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <For each={[1, 2, 3, 4]}>{() => <Skeleton class="h-40 w-full" />}</For>
          </div>
        </div>
      }>
        <Show
          when={query.error}
          fallback={
            <>
              <Show when={view() === "board"}>
                <Kanban cards={cards()} onStatus={onStatus} onDetail={setDetailId} pendingId={pendingId()} />
              </Show>

              <Show when={view() === "list"}>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <For each={cards()}>
                    {(card) => (
                      <CardTile
                        card={card}
                        onStatus={(status) => onStatus(card.id, status)}
                        onDetail={() => setDetailId(card.id)}
                        busy={pendingId() === card.id}
                      />
                    )}
                  </For>
                </div>
              </Show>

              <Show when={!query.isLoading && cards().length === 0}>
                <EmptyState
                  icon={Rocket}
                  title="No cards yet"
                  description="Open an issue or pull request in a connected repository to see it turn into a ship-feed card."
                />
              </Show>
            </>
          }
        >
          <div class="rounded-2xl bg-rose-50 border border-rose-100 p-6 text-rose-700">
            <p>Failed to load cards. Is the API running?</p>
          </div>
        </Show>
      </Show>

      <Show when={detailId()}>
        <CardDetail
          cardId={detailId()!}
          onClose={() => {
            setDetailId(null);
            setSearchParams({ detail: undefined });
          }}
        />
      </Show>
    </div>
  );
}

function SummaryCard(props: {
  label: string;
  value: number;
  icon: typeof Clock;
  color: "gray" | "emerald" | "rose" | "indigo";
  active: boolean;
  onClick: () => void;
}) {
  const colors = {
    gray: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
    emerald: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100",
    rose: "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100",
  };
  const Icon = props.icon;

  return (
    <button
      onClick={props.onClick}
      class={`text-left rounded-2xl border p-4 transition ${colors[props.color]} ${props.active ? "ring-2 ring-offset-2 ring-indigo-500" : ""}`}
    >
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold uppercase tracking-wide opacity-80">{props.label}</span>
        <Icon size={16} class="opacity-60" />
      </div>
      <div class="text-2xl font-bold">{props.value}</div>
    </button>
  );
}
