import { assertReleaseNotes } from "@ship-feed/shared";
import { API_URL, fetchJson } from "./client";

export async function fetchReleaseNotes(
  from?: string,
  to?: string
): Promise<{ title: string; markdown: string; cards: { id: string; title: string; repoFullName: string }[] }> {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  return fetchJson(`${API_URL}/api/releases/notes?${params.toString()}`, assertReleaseNotes);
}
