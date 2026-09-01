import { createSignal, For, Index, onMount, onCleanup } from "solid-js";
import type { ShipCard } from "@ship-feed/shared";
import { fetchCards, swipeCard, flushOfflineQueue } from "../api";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card";
import { useQuery } from "@tanstack/solid-query";
import { isOnline } from "../lib/offline";

export default function Feed() {
  const query = useQuery(() => ({ queryKey: ["cards"], queryFn: fetchCards }));
  const [current, setCurrent] = createSignal(0);
  const [expanded, setExpanded] = createSignal(false);
  const [queued, setQueued] = createSignal(0);

  const cards = () => query.data ?? [];

  onMount(() => {
    flushOfflineQueue((remaining) => setQueued(remaining));
    const onOnline = () => flushOfflineQueue((remaining) => setQueued(remaining));
    window.addEventListener("online", onOnline);
    onCleanup(() => window.removeEventListener("online", onOnline));
  });

  const onSwipe = async (direction: "approve" | "reject") => {
    const list = cards();
    const i = current();
    const card = list[i];
    if (!card) return;
    const result = await swipeCard({ cardId: card.id, direction });
    if ("queued" in result && result.queued) {
      setQueued((q) => q + 1);
    }
    setExpanded(false);
    setCurrent((c) => c + 1);
  };

  return (
    <div class="h-screen w-screen flex flex-col bg-gray-950 text-white">
      <div class="flex-1 relative overflow-hidden">
        <For each={cards()}>
          {(card, idx) => (
            <Card
              card={card}
              active={idx() === current()}
              hidden={idx() < current()}
              expanded={expanded()}
              onToggleExpand={() => setExpanded((e) => !e)}
              onSwipe={onSwipe}
            />
          )}
        </For>
        {current() >= cards().length && (
          <div class="absolute inset-0 flex items-center justify-center p-8 text-center">
            <div>
              <h2 class="text-2xl font-bold mb-2">All caught up</h2>
              <p class="text-gray-400">No more cards to review right now.</p>
            </div>
          </div>
        )}
        {!isOnline() && (
          <div class="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-amber-500/90 text-xs font-bold text-white">
            offline
          </div>
        )}
        {queued() > 0 && isOnline() && (
          <div class="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-indigo-500/90 text-xs font-bold text-white">
            {queued()} queued
          </div>
        )}
      </div>
      <BottomNav active="feed" />
    </div>
  );
}
