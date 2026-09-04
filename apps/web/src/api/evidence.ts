import type { EvidenceRecord } from "@ship-feed/shared";
import { API_URL, fetchJson } from "./client";

export async function fetchEvidence(cardId: string): Promise<EvidenceRecord[]> {
  return fetchJson(`${API_URL}/api/cards/${cardId}/evidence`);
}

export async function fetchEvidenceContent(evidenceId: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/evidence/${evidenceId}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch evidence content");
  return res.text();
}
