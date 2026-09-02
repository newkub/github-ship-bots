import { For, Show } from "solid-js";
import { useQuery } from "@tanstack/solid-query";
import { fetchCards } from "../api";
import BottomNav from "../components/BottomNav";
import EmptyState from "../components/EmptyState";
import { kindIcons, scoreColor } from "../components/Card";
import { History } from "lucide-solid";

export default function Reviewed() {
  const query = useQuery(() => ({ queryKey: ["cards"], queryFn: fetchCards }));
  const decided = () => query.data?.filter((c) => c.status !== "pending") ?? [];

  return (
    <div class="h-screen w-screen flex flex-col bg-app text-primary">
      <header class="pt-safe px-6 py-4 bg-surface border-b border-divider flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold">Reviewed</h1>
          <p class="text-sm text-muted">Cards you have already decided</p>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-elevated text-xs font-semibold text-muted border border-divider">
          {decided().length}
        </span>
      </header>

      <div class="flex-1 overflow-y-auto p-4 no-scrollbar">
        <For each={decided()}>
          {(card) => {
            const Icon = kindIcons[card.kind];
            return (
              <div class="bg-surface rounded-2xl p-4 border border-divider mb-3 shadow-sm">
                <div class="flex justify-between items-start mb-3">
                  <div class="flex items-center gap-2">
                    <div class="h-8 w-8 rounded-full bg-elevated flex items-center justify-center text-muted">
                      <Icon size={16} />
                    </div>
                    <span class="text-xs uppercase tracking-wide text-muted font-semibold">{card.kind}</span>
                  </div>
                  <span
                    class={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      card.status === "approved" ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
                    }`}
                  >
                    {card.status}
                  </span>
                </div>
                <h3 class="font-semibold text-primary mb-1">{card.title}</h3>
                <p class="text-sm text-muted line-clamp-2 mb-3">{card.description}</p>
                <div class="flex items-center gap-3 text-xs">
                  <span class={`px-2 py-1 rounded-full ${scoreColor(card.score)}`}>
                    score {card.score.toFixed(1)}
                  </span>
                  <span class="text-muted-2">{card.repoFullName}</span>
                </div>
              </div>
            );
          }}
        </For>

        <Show when={!query.isLoading && decided().length === 0}>
          <EmptyState
            class="h-full"
            icon={History}
            title="No reviewed cards yet"
            subtitle="Cards you approve or reject will show up here for reference."
          />
        </Show>
      </div>
      <BottomNav active="reviewed" />
    </div>
  );
}
