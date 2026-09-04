import type { ShipCard, User, EvidenceRecord, CommentTemplate, CardComment } from "@ship-feed/shared";

const envUrl = import.meta.env.VITE_API_URL as string | undefined;
export const API_URL = envUrl && envUrl !== "undefined" ? envUrl : (typeof window !== "undefined" ? window.location.origin : "");

if (!API_URL) throw new Error("Missing VITE_API_URL");
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
export async function fetchEvidence(cardId: string): Promise<EvidenceRecord[]> {
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
export async function logout(): Promise<void> {
  const res = await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
  if (!res.ok) throw new Error("Failed to log out");
}
export async function createCheckout(): Promise<{ url: string }> {
  const res = await fetch(`${API_URL}/api/stripe/checkout`, { method: "POST", credentials: "include" });
  if (!res.ok) throw new Error("Failed to start checkout");
  return res.json();
}
export async function fetchPlugins(): Promise<{ id: string; name: string; description: string; installs: number; icon: string; installed: boolean }[]> {
  const res = await fetch(`${API_URL}/api/plugins`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch plugins");
  return res.json();
}
export async function installPlugin(id: string) {
  const res = await fetch(`${API_URL}/api/plugins/${id}/install`, { method: "POST", credentials: "include" });
  if (!res.ok) throw new Error("Failed to install plugin");
  return res.json();
}
export async function uninstallPlugin(id: string) {
  const res = await fetch(`${API_URL}/api/plugins/${id}/uninstall`, { method: "POST", credentials: "include" });
  if (!res.ok) throw new Error("Failed to uninstall plugin");
  return res.json();
}
export function checkoutUrl() {
  return `${API_URL}/api/stripe/checkout`;
}
export async function fetchPlans(): Promise<{ id: string; name: string; price: string; features: string[] }[]> {
  const res = await fetch(`${API_URL}/api/stripe/plans`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch plans");
  const data = await res.json() as { plans: { id: string; name: string; price: string; features: string[] }[] };
  return data.plans;
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
export async function fetchExplain(id: string): Promise<{
  base: number;
  averageWeight: number;
  adjustment: number;
  final: number;
  features: { feature: string; value: string; weight: number; defaultWeight: number; adjustment: number }[];
}> {
  const res = await fetch(`${API_URL}/api/cards/${id}/explain`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch explanation");
  return res.json();
}
export async function fetchVotes(id: string): Promise<{
  minApprovers: number;
  minRejectors: number;
  votes: { direction: string; user: string }[];
}> {
  const res = await fetch(`${API_URL}/api/cards/${id}/votes`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch votes");
  return res.json();
}
export async function fetchTemplates(repo?: string): Promise<CommentTemplate[]> {
  const url = repo ? `${API_URL}/api/templates?repo=${encodeURIComponent(repo)}` : `${API_URL}/api/templates`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch templates");
  return res.json();
}
export async function createTemplate(data: { name: string; body: string; repoFullName?: string }) {
  const res = await fetch(`${API_URL}/api/templates`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create template");
  return res.json();
}
export async function applyTemplate(templateId: string, cardId: string) {
  const res = await fetch(`${API_URL}/api/templates/${templateId}/comment`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ cardId }),
  });
  if (!res.ok) throw new Error("Failed to apply template");
  return res.json();
}
export async function fetchComments(cardId: string): Promise<CardComment[]> {
  const res = await fetch(`${API_URL}/api/cards/${cardId}/comments`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}
