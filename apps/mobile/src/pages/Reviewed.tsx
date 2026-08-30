import { For } from "solid-js";
import { useQuery } from "@tanstack/solid-query";
import { fetchCards } from "../api";
import BottomNav from "../components/BottomNav";

export default function Reviewed() {
  const query = useQuery(() => ({ queryKey: ["cards"], queryFn: fetchCards }));
  const decided = () => query.data?.filter((c) => c.status !== "pending") ?? [];

  return (
    <div class="h-screen w-screen flex flex-col bg-gray-950 text-white">
      <header class="pt-safe px-6 py-4 bg-gray-900 border-b border-gray-800">
        <h1 class="text-xl font-bold">Reviewed</h1>
      </header>
      <div class="flex-1 overflow-y-auto p-4 space-y-3">
        <For each={decided()}>
          {(card) => (
            <div class="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs uppercase tracking-wide text-gray-400">{card.kind}</span>
                <span
                  class={`text-xs px-2 py-1 rounded-full ${
                    card.status === "approved" ? "bg-emerald-600" : "bg-red-600"
                  }`}
                >
                  {card.status}
                </span>
              </div>
              <h3 class="font-semibold mb-1">{card.title}</h3>
              <p class="text-sm text-gray-400 line-clamp-2">{card.description}</p>
            </div>
          )}
        </For>
      </div>
      <BottomNav active="reviewed" />
    </div>
  );
}
