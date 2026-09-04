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
import SummaryCard from "../components/SummaryCard";

const statusFilters: CardStatus[] = ["pending", "approved", "rejected", "shipped"];

export default function Cards() {
  const queryClient = useQueryClient();
  const query = useQuery(() => ({ queryKey: ["cards"], queryFn: fetchCards, retry: 1, staleTime: 5_000 }));
  const reposQuery = useQuery(() => ({ queryKey: ["repos"], queryFn: fetchRepos, retry: 1, staleTime: 30_000 }));
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

  const countsBy = (key: CardStatus) => counts()[key];

  return (
    <div>
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-zinc-100">Dashboard</h1>
            <p class="text-sm text-gray-500 dark:text-zinc-400 mt-1">Overview, queue, health, and actions for your ship loop.</p>
          </div>
          <div class="flex items-center gap-2">
            <ViewToggle view={view()} onChange={setView} />
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <SummaryCard label="Pending" value={counts().pending} icon={Clock} color="gray" active={filter() === "pending"} onClick={() => setFilter("pending")} />
          <SummaryCard label="Approved" value={counts().approved} icon={Check} color="emerald" active={filter() === "approved"} onClick={() => setFilter("approved")} />
          <SummaryCard label="Rejected" value={counts().rejected} icon={X} color="rose" active={filter() === "rejected"} onClick={() => setFilter("rejected")} />
          <SummaryCard label="Shipped" value={counts().shipped} icon={Package} color="indigo" active={filter() === "shipped"} onClick={() => setFilter("shipped")} />
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <FilterChip active={filter() === "all"} onClick={() => setFilter("all")} label={`All (${counts().total})`} />
          <For each={statusFilters}>
            {(key) => <FilterChip active={filter() === key} onClick={() => setFilter(key)} label={`${key[0]!.toUpperCase() + key.slice(1)} (${countsBy(key)})`} />}
          </For>

          <Show when={!reposQuery.isLoading && reposQuery.data && reposQuery.data.length > 0}>
            <div class="h-5 w-px bg-gray-200 dark:bg-zinc-700 mx-1" />
            <GitBranch size={14} class="text-gray-400 dark:text-zinc-500" />
            <For each={["all", ...reposQuery.data!]}>
              {(repo) => <FilterChip active={repoFilter() === repo} onClick={() => setRepoFilter(repo)} label={repo === "all" ? "All repos" : repo} />}
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

function ViewToggle(props: { view: "list" | "board"; onChange: (v: "list" | "board") => void }) {
  const active = "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm";
  const inactive = "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100";
  return (
    <div class="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
      <button onClick={() => props.onChange("board")} class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${props.view === "board" ? active : inactive}`}>
        <Grid3X3 size={14} /> Board
      </button>
      <button onClick={() => props.onChange("list")} class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${props.view === "list" ? active : inactive}`}>
        <List size={14} /> List
      </button>
    </div>
  );
}

function FilterChip(props: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={props.onClick}
      class={`px-3 py-1.5 rounded-full text-xs font-medium transition max-w-[14rem] truncate ${
        props.active
          ? "bg-indigo-600 text-white shadow-sm"
          : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
      }`}
      title={props.label}
    >
      {props.label}
    </button>
  );
}
