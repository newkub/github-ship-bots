import type { User } from "@ship-feed/shared";
import { API_URL, fetchJson } from "./client";

export function loginUrl() {
  return `${API_URL}/auth/login`;
}

export async function fetchSession(): Promise<{ user?: User }> {
  return fetchJson(`${API_URL}/auth/session`);
}

export async function logout(): Promise<void> {
  const res = await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
  if (!res.ok) throw new Error("Failed to log out");
}
