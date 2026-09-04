import type { User } from "@ship-feed/shared";
import { assertSession } from "@ship-feed/shared";
import { API_URL, fetchJson } from "./client";

export async function getSession(): Promise<{ user?: User }> {
  return fetchJson(`${API_URL}/auth/session`, assertSession);
}

export function loginUrl() {
  return `${API_URL}/auth/login`;
}
