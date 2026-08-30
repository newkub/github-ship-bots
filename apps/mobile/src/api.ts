import type { ShipCard, SwipeEvent } from "@ship-feed/shared";

const API_URL = import.meta.env.VITE_API_URL || "https://github-ship-bots.newkubise.workers.dev";

export async function fetchCards(): Promise<ShipCard[]> {
  const res = await fetch(`${API_URL}/api/cards`);
  if (!res.ok) throw new Error("Failed to fetch cards");
  return res.json();
}

export async function swipeCard({ cardId, direction }: { cardId: string; direction: SwipeEvent["direction"] }) {
  const res = await fetch(`${API_URL}/api/cards/${cardId}/swipe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ direction }),
  });
  if (!res.ok) throw new Error("Failed to swipe card");
  return res.json();
}

export async function getSession(): Promise<{ user?: unknown }> {
  const res = await fetch(`${API_URL}/auth/session`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
}

export function loginUrl() {
  return `${API_URL}/auth/login`;
}
