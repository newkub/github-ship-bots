import { createSignal, For, Show, onMount, onCleanup } from "solid-js";
import type { ShipCard } from "@ship-feed/shared";
import { fetchCards, swipeCard, flushOfflineQueue } from "../api";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card";
import PromptInput from "../components/PromptInput";
import UndoToast from "../components/UndoToast";
import { useQuery } from "@tanstack/solid-query";
import { isOnline } from "../lib/offline";

export default function Feed() {
  const query = useQuery(() => ({ queryKey: ["cards"], queryFn: fetchCards }));
  const [current, setCurrent] = createSignal(0);
  const [expanded, setExpanded] = createSignal(false);
  const [queued, setQueued] = createSignal(0);
  const [nudgeCount, setNudgeCount] = createSignal(2);
  const [showPrompt, setShowPrompt] = createSignal(false);
  const [pendingPrompt, setPendingPrompt] = createSignal<string | undefined>(undefined);
  const [lastSwipe, setLastSwipe] = createSignal<{ direction: "approve" | "reject"; previous: number } | null>(null);

  const cards = () => query.data ?? [];

  onMount(() => {
    flushOfflineQueue((remaining) => setQueued(remaining));
    const onOnline = () => flushOfflineQueue((remaining) => setQueued(remaining));
    window.addEventListener("online", onOnline);
    onCleanup(() => window.removeEventListener("online", onOnline));
  });

  const doSwipe = async (direction: "approve" | "reject", prompt?: string) => {
    const list = cards();
    const i = current();
    const card = list[i];
    if (!card) return;
    const result = await swipeCard({ cardId: card.id, direction, comment: prompt });
    if ("queued" in result && result.queued) {
      setQueued((q) => q + 1);
    }
    setLastSwipe({ direction, previous: i });
    setPendingPrompt(undefined);
    setExpanded(false);
    setCurrent((c) => c + 1);
    setNudgeCount((n) => Math.max(0, n - 1));
  };

  const onSwipe = (direction: "approve" | "reject") => {
    doSwipe(direction, pendingPrompt());
  };

  const onAddPrompt = () => {
    setShowPrompt(true);
  };

  const onPromptSubmit = (text: string) => {
    setPendingPrompt(text);
    setShowPrompt(false);
  };

  const onUndo = () => {
    const last = lastSwipe();
    if (!last) return;
    setCurrent(last.previous);
    setLastSwipe(null);
    const opposite = last.direction === "approve" ? "reject" : "approve";
    const card = cards()[last.previous];
    if (card) {
      swipeCard({ cardId: card.id, direction: opposite }).catch(() => {});
    }
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
              prompt={pendingPrompt()}
              onToggleExpand={() => setExpanded((e) => !e)}
              onSwipe={onSwipe}
              onAddPrompt={onAddPrompt}
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

        <Show when={lastSwipe()}>
          {(swipe) => <UndoToast direction={swipe().direction} onUndo={onUndo} />}
        </Show>

        <Show when={showPrompt()}>
          <PromptInput onSubmit={onPromptSubmit} onCancel={() => setShowPrompt(false)} />
        </Show>
      </div>
      <BottomNav active="feed" nudgeCount={nudgeCount()} />
    </div>
  );
}
