import type { ShipCard, SwipeEvent } from "@ship-feed/shared";
import { isOnline, queueSwipe, getQueue, setQueue } from "./lib/offline";

const envUrl = import.meta.env.VITE_API_URL as string | undefined;
export const API_URL = envUrl && envUrl !== "undefined" ? envUrl : (typeof window !== "undefined" ? window.location.origin : "");

if (!API_URL) throw new Error("Missing VITE_API_URL");
export async function fetchCards(): Promise<ShipCard[]> {
  const res = await fetch(`${API_URL}/api/cards`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch cards");
  return res.json();
}
export async function fetchNudges(): Promise<ShipCard[]> {
  const res = await fetch(`${API_URL}/api/cards/nudges`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch nudges");
  return res.json();
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
  const res = await fetch(`${API_URL}/api/cards/${cardId}/swipe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ direction, comment }),
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
export async function getSession(): Promise<{ user?: unknown }> {
  const res = await fetch(`${API_URL}/auth/session`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
}
export function loginUrl() {
  return `${API_URL}/auth/login`;
}
