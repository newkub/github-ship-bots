import { For } from "solid-js";
import { previewCards, columns } from "./data";
import MiniCard from "./MiniCard";

export default function Kanban() {
  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <For each={columns}>
        {(col) => {
          const Icon = col.icon;
          const items = previewCards.filter((c) => c.status === col.status);
          return (
            <div class="flex flex-col rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-3 min-h-[12rem]">
              <div class="flex items-center justify-between mb-3 px-1">
                <div class="flex items-center gap-2">
                  <div class="h-7 w-7 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center">
                    <Icon size={14} />
                  </div>
                  <span class="text-sm font-bold text-zinc-200">{col.label}</span>
                </div>
                <span class="text-xs font-semibold text-zinc-500 bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <div class="flex-1 space-y-3">
                <For each={items}>
                  {(card) => <MiniCard card={card} />}
                </For>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}
