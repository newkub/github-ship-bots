import type { ShipCard, User } from "@ship-feed/shared";

const API_URL = import.meta.env.VITE_API_URL || "https://github-ship-bots.newkubise.workers.dev";

export async function fetchCards(): Promise<ShipCard[]> {
  const res = await fetch(`${API_URL}/api/cards`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch cards");
  return res.json();
}

export async function fetchQueue(): Promise<ShipCard[]> {
  const res = await fetch(`${API_URL}/api/cards/queue`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch queue");
  return res.json();
}

export async function fetchNudges(): Promise<ShipCard[]> {
  const res = await fetch(`${API_URL}/api/cards/nudges`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch nudges");
  return res.json();
}

export async function fetchRepos(): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/repos`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch repos");
  return res.json();
}

export async function fetchCard(id: string): Promise<ShipCard> {
  const res = await fetch(`${API_URL}/api/cards/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch card");
  return res.json();
}

export async function fetchEvidence(cardId: string): Promise<Record<string, unknown>[]> {
  const res = await fetch(`${API_URL}/api/cards/${cardId}/evidence`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch evidence");
  return res.json();
}

export async function fetchEvidenceContent(evidenceId: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/evidence/${evidenceId}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch evidence content");
  return res.text();
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

export async function shipCard(cardId: string) {
  const res = await fetch(`${API_URL}/api/cards/${cardId}/ship`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to ship card");
  return res.json();
}

export async function rejectCardAction(cardId: string) {
  const res = await fetch(`${API_URL}/api/cards/${cardId}/reject`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to reject card");
  return res.json();
}

export function loginUrl() {
  return `${API_URL}/auth/login`;
}

export function checkoutUrl() {
  return `${API_URL}/api/stripe/checkout`;
}

export async function submitInspector(data: { url: string; selector: string; prompt: string; repoFullName: string }) {
  const res = await fetch(`${API_URL}/api/inspector`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit inspector");
  return res.json();
}
