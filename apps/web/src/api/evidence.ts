import type { EvidenceRecord } from "@ship-feed/shared";
import { assertEvidenceRecordArray } from "@ship-feed/shared";
import { API_URL, fetchJson, fetchWithTimeout } from "./client";

export async function fetchEvidence(cardId: string, tags?: string[]): Promise<EvidenceRecord[]> {
  const qs = tags && tags.length > 0 ? `?tags=${encodeURIComponent(tags.join(","))}` : "";
  return fetchJson(`${API_URL}/api/cards/${cardId}/evidence${qs}`, assertEvidenceRecordArray);
}

export async function fetchEvidenceContent(evidenceId: string): Promise<string> {
  const res = await fetchWithTimeout(`${API_URL}/api/evidence/${evidenceId}`);
  if (!res.ok) throw new Error("Failed to fetch evidence content");
  return res.text();
}
