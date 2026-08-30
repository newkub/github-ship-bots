import type { ShipCard, User } from "@ship-feed/shared";

const API_URL = import.meta.env.VITE_API_URL || "https://github-ship-bots.newkubise.workers.dev";

export async function fetchCards(): Promise<ShipCard[]> {
  const res = await fetch(`${API_URL}/api/cards`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch cards");
  return res.json();
}

export async function fetchSession(): Promise<{ user?: User }> {
  const res = await fetch(`${API_URL}/auth/session`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch session");
  return res.json();
}

export async function updateCardStatus(cardId: string, status: ShipCard["status"]) {
  const res = await fetch(`${API_URL}/api/cards/${cardId}/status`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update card");
  return res.json();
}

export function loginUrl() {
  return `${API_URL}/auth/login`;
}

export function checkoutUrl() {
  return `${API_URL}/api/stripe/checkout`;
}

export async function submitInspector(data: { url: string; selector: string; prompt: string }) {
  const res = await fetch(`${API_URL}/api/inspector`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit inspector");
  return res.json();
}
