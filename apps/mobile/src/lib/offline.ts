import type { SwipeEvent } from "@ship-feed/shared";

const QUEUE_KEY = "ship-feed:offline-swipes";

export type QueuedSwipe = { cardId: string; direction: SwipeEvent["direction"]; comment?: string; createdAt: number };

export function isOnline() {
  return typeof navigator !== "undefined" && navigator.onLine;
}

export function queueSwipe(cardId: string, direction: SwipeEvent["direction"], comment?: string) {
  const queue = getQueue();
  queue.push({ cardId, direction, comment, createdAt: Date.now() });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function getQueue(): QueuedSwipe[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is QueuedSwipe => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Record<string, unknown>;
      return typeof candidate.cardId === "string" && (candidate.direction === "approve" || candidate.direction === "reject") && typeof candidate.createdAt === "number";
    });
  } catch {
    return [];
  }
}

export function setQueue(queue: QueuedSwipe[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function clearQueue() {
  localStorage.removeItem(QUEUE_KEY);
}
