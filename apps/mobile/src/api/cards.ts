import type { ShipCard, SwipeEvent } from "@ship-feed/shared";
import { API_URL, fetchJson, postJson } from "./client";
import { isOnline, queueSwipe, getQueue, setQueue } from "../lib/offline";

export async function fetchCards(): Promise<ShipCard[]> {
  return fetchJson(`${API_URL}/api/cards`);
}

export async function fetchNudges(): Promise<ShipCard[]> {
  return fetchJson(`${API_URL}/api/cards/nudges`);
}

export async function swipeCard({
  cardId,
  direction,
  comment,
}: {
  cardId: string;
  direction: SwipeEvent["direction"];
  comment?: string;
}): Promise<{ ok: true; queued: true } | { ok: true; status: string }> {
  if (!isOnline()) {
    queueSwipe(cardId, direction, comment);
    return { ok: true, queued: true };
  }
  return syncSwipe({ cardId, direction, comment });
}

export async function syncSwipe({
  cardId,
  direction,
  comment,
}: {
  cardId: string;
  direction: SwipeEvent["direction"];
  comment?: string;
}): Promise<{ ok: true; status: string }> {
  return postJson(`${API_URL}/api/cards/${cardId}/swipe`, { direction, comment });
}

export async function undoSwipe(cardId: string): Promise<{ ok: true; status: string; undone: string }> {
  return postJson(`${API_URL}/api/cards/${cardId}/undo`, {});
}

export async function flushOfflineQueue(onProgress?: (remaining: number) => void) {
  let queue = getQueue();
  while (queue.length > 0) {
    const item = queue[0];
    if (!item) break;
    try {
      await syncSwipe({ cardId: item.cardId, direction: item.direction, comment: item.comment });
      queue = queue.slice(1);
      setQueue(queue);
      onProgress?.(queue.length);
    } catch {
      break;
    }
  }
  return queue.length;
}
