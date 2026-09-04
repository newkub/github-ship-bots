import { API_URL, fetchJson } from "./client";

export async function fetchRepos(): Promise<string[]> {
  return fetchJson(`${API_URL}/api/repos`);
}
