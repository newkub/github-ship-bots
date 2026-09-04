import { createSignal, For, Show, onMount, onCleanup } from "solid-js";
import type { ShipCard } from "@ship-feed/shared";
import type { QueuedSwipe } from "../lib/offline";
import { fetchCards, fetchNudges, swipeCard, undoSwipe, flushOfflineQueue } from "../api";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card";
import PromptInput from "../components/PromptInput";
import UndoToast from "../components/UndoToast";
import EmptyState from "../components/EmptyState";
import { useQuery } from "@tanstack/solid-query";
import { isOnline } from "../lib/offline";
import { Inbox, Check } from "lucide-solid";

export default function Feed() {
  const query = useQuery(() => ({ queryKey: ["cards"], queryFn: fetchCards }));
  const [current, setCurrent] = createSignal(0);
  const [expanded, setExpanded] = createSignal(false);
  const [queued, setQueued] = createSignal(0);
  const [nudgeCount, setNudgeCount] = createSignal(0);
  const [showPrompt, setShowPrompt] = createSignal(false);
  const [pendingPrompt, setPendingPrompt] = createSignal<string | undefined>(undefined);
  const [lastSwipe, setLastSwipe] = createSignal<{ direction: "approve" | "reject"; previous: number } | null>(null);
  const [swipeError, setSwipeError] = createSignal<string | null>(null);

  const cards = () => query.data ?? [];

  const onOfflineError = (_err: unknown, item: QueuedSwipe) => setSwipeError(`Offline swipe for ${item.cardId} failed`);

  onMount(() => {
    flushOfflineQueue((remaining) => setQueued(remaining), onOfflineError);
    fetchNudges().then((nudges) => setNudgeCount(nudges.length)).catch((err) => {
      console.error("failed to fetch nudges", err instanceof Error ? err.message : String(err));
      setNudgeCount(0);
    });
    const onOnline = () => flushOfflineQueue((remaining) => setQueued(remaining), onOfflineError);
    window.addEventListener("online", onOnline);
    onCleanup(() => window.removeEventListener("online", onOnline));
  });

  const vibrate = (pattern: number | number[] = 40) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const doSwipe = async (direction: "approve" | "reject", prompt?: string) => {
    setSwipeError(null);
    vibrate(direction === "approve" ? [20, 30, 20] : [40]);
    const list = cards();
    const i = current();
    const card = list[i];
    if (!card) return;

    try {
      const result = await swipeCard({ cardId: card.id, direction, comment: prompt });
      if ("queued" in result && result.queued) {
        setQueued((q) => q + 1);
      }

      setLastSwipe({ direction, previous: i });
      setPendingPrompt(undefined);
      setExpanded(false);
      setCurrent((c) => c + 1);
      setNudgeCount((n) => Math.max(0, n - 1));
    } catch (err) {
      setSwipeError(err instanceof Error ? err.message : "Swipe failed. Please try again.");
    }
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

  const onUndo = async () => {
    const last = lastSwipe();
    if (!last) return;

    setSwipeError(null);
    setCurrent(last.previous);
    setLastSwipe(null);
    const card = cards()[last.previous];
    if (card) {
      try {
        await undoSwipe(card.id);
        query.refetch();
      } catch (err) {
        setSwipeError(err instanceof Error ? err.message : "Undo failed. Please try again.");
      }
    }
  };

  const isEmpty = () => !query.isLoading && cards().length === 0;
  const isDone = () => !query.isLoading && cards().length > 0 && current() >= cards().length;

  return (
    <div class="h-screen w-screen flex flex-col bg-app text-primary pt-safe">
      <Show when={swipeError()}>
        <div class="px-4 py-2 bg-danger/10 text-danger text-xs font-semibold border-b border-danger/30 text-center">
          {swipeError()}
        </div>
      </Show>

      <div class="flex-1 relative overflow-hidden">
        <For each={cards()}>
          {(card, idx) => (
            <Card
              card={card}
              active={idx() === current()}
              hidden={idx() < current()}
              stackIndex={idx() - current()}
              expanded={expanded()}
              prompt={pendingPrompt()}
              onToggleExpand={() => setExpanded((e) => !e)}
              onSwipe={onSwipe}
              onAddPrompt={onAddPrompt}
            />
          )}
        </For>

        <Show when={query.isLoading}>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="h-10 w-10 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
          </div>
        </Show>

        <Show when={query.error}>
          <EmptyState
            class="absolute inset-0"
            icon={Inbox}
            title="Failed to load cards"
            subtitle={query.error?.message ?? "Check your connection and try again."}
            action={{ label: "Retry", onClick: () => query.refetch() }}
          />
        </Show>

        <Show when={isEmpty()}>
          <EmptyState
            class="absolute inset-0"
            icon={Inbox}
            title="Welcome to ship-feed"
            subtitle="Your issue and PR cards will appear here. Swipe right to approve, left to reject, or tap a card to see more."
            action={{ label: "Refresh", onClick: () => query.refetch() }}
          />
        </Show>

        <Show when={isDone()}>
          <EmptyState
            class="absolute inset-0"
            icon={Check}
            title="All caught up"
            subtitle="No more cards to review right now. Pull down or refresh when new cards arrive."
            action={{ label: "Refresh", onClick: () => query.refetch() }}
          />
        </Show>

        <div class="absolute top-4 left-4 right-4 z-20 flex flex-col items-start gap-2 pointer-events-none">
          <Show when={!isOnline()}>
            <span class="px-3 py-1.5 rounded-full bg-warning text-xs font-bold text-white shadow-lg pointer-events-auto">
              offline
            </span>
          </Show>
          <Show when={queued() > 0 && isOnline()}>
            <span class="px-3 py-1.5 rounded-full bg-accent text-xs font-bold text-white shadow-lg pointer-events-auto">
              {queued()} queued
            </span>
          </Show>
        </div>

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
