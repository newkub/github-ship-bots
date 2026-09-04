import { API_URL, fetchJson } from "./client";

export async function getSession(): Promise<{ user?: unknown }> {
  return fetchJson(`${API_URL}/auth/session`);
}

export function loginUrl() {
  return `${API_URL}/auth/login`;
}
