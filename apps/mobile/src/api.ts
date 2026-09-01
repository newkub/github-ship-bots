import type { ShipCard, SwipeEvent } from "@ship-feed/shared";
import { isOnline, queueSwipe, getQueue, setQueue } from "./lib/offline";

const API_URL = import.meta.env.VITE_API_URL || "https://github-ship-bots.newkubise.workers.dev";

export async function fetchCards(): Promise<ShipCard[]> {
  const res = await fetch(`${API_URL}/api/cards`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch cards");
  return res.json();
}

export async function swipeCard({
  cardId,
  direction,
}: {
  cardId: string;
  direction: SwipeEvent["direction"];
}): Promise<{ ok: true; queued: true } | { ok: true; status: string }> {
  if (!isOnline()) {
    queueSwipe(cardId, direction);
    return { ok: true, queued: true };
  }

  return syncSwipe({ cardId, direction });
}

export async function syncSwipe({
  cardId,
  direction,
}: {
  cardId: string;
  direction: SwipeEvent["direction"];
}): Promise<{ ok: true; status: string }> {
  const res = await fetch(`${API_URL}/api/cards/${cardId}/swipe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ direction }),
  });
  if (!res.ok) throw new Error("Failed to swipe card");
  return res.json();
}

export async function flushOfflineQueue(onProgress?: (remaining: number) => void) {
  let queue = getQueue();
  while (queue.length > 0) {
    const item = queue[0];
    if (!item) break;
    try {
      await syncSwipe({ cardId: item.cardId, direction: item.direction });
      queue = queue.slice(1);
      setQueue(queue);
      onProgress?.(queue.length);
    } catch {
      break;
    }
  }
  return queue.length;
}

export async function getSession(): Promise<{ user?: unknown }> {
  const res = await fetch(`${API_URL}/auth/session`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
}

export function loginUrl() {
  return `${API_URL}/auth/login`;
}
