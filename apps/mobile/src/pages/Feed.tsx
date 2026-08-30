import { createSignal, For, Index, onMount } from "solid-js";
import type { ShipCard } from "@ship-feed/shared";
import { fetchCards, swipeCard } from "../api";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card";
import { useQuery } from "@tanstack/solid-query";

export default function Feed() {
  const query = useQuery(() => ({ queryKey: ["cards"], queryFn: fetchCards }));
  const [current, setCurrent] = createSignal(0);
  const [expanded, setExpanded] = createSignal(false);

  const cards = () => query.data ?? [];

  const onSwipe = async (direction: "approve" | "reject") => {
    const list = cards();
    const i = current();
    const card = list[i];
    if (!card) return;
    await swipeCard({ cardId: card.id, direction });
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
      </div>
      <BottomNav active="feed" />
    </div>
  );
}
