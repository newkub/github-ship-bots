import { For, createMemo } from "solid-js";
import { Check, Clock, Package, X } from "lucide-solid";
import type { ShipCard, CardStatus } from "@ship-feed/shared";
import CardTile from "./CardTile";

const columns: { status: CardStatus; label: string; icon: typeof Clock; gradient: string }[] = [
  { status: "pending", label: "Pending", icon: Clock, gradient: "from-gray-400 to-gray-600" },
  { status: "approved", label: "Approved", icon: Check, gradient: "from-emerald-400 to-emerald-600" },
  { status: "rejected", label: "Rejected", icon: X, gradient: "from-rose-400 to-rose-600" },
  { status: "shipped", label: "Shipped", icon: Package, gradient: "from-indigo-400 to-indigo-600" },
];

export default function Kanban(props: {
  cards: ShipCard[];
  onStatus: (id: string, status: CardStatus) => void;
  onDetail: (id: string) => void;
  pendingId: string | null;
}) {
  const byColumn = createMemo(() => {
    const map: Record<CardStatus, ShipCard[]> = { pending: [], approved: [], rejected: [], shipped: [] };
    for (const card of props.cards) {
      map[card.status].push(card);
    }
    return map;
  });

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <For each={columns}>
        {(col) => {
          const Icon = col.icon;
          const items = byColumn()[col.status];
          return (
            <div class="flex flex-col rounded-2xl bg-gray-50/80 dark:bg-zinc-900/60 border border-gray-200/60 dark:border-zinc-800 p-3 min-h-[200px]">
              <div class="flex items-center justify-between mb-3 px-1">
                <div class="flex items-center gap-2">
                  <div
                    class={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${col.gradient} text-white`}
                  >
                    <Icon size={14} />
                  </div>
                  <span class="text-sm font-bold text-gray-800 dark:text-zinc-100">{col.label}</span>
                </div>
                <span class="text-xs font-semibold text-gray-500 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>

              <div class="flex-1 space-y-3">
                <For each={items}>
                  {(card) => (
                    <CardTile
                      card={card}
                      onStatus={(status) => props.onStatus(card.id, status)}
                      onDetail={() => props.onDetail(card.id)}
                      busy={props.pendingId === card.id}
                      compact
                    />
                  )}
                </For>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}
