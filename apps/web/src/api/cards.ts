import type { ShipCard, CardComment } from "@ship-feed/shared";
import { assertShipCard, assertShipCardArray, assertCardCommentArray, assertExplain, assertVotes, assertOk } from "@ship-feed/shared";
import { API_URL, fetchJson, postJson } from "./client";

export async function fetchCards(): Promise<ShipCard[]> {
  return fetchJson(`${API_URL}/api/cards`, assertShipCardArray);
}

export async function fetchQueue(): Promise<ShipCard[]> {
  return fetchJson(`${API_URL}/api/cards/queue`, assertShipCardArray);
}

export async function fetchNudges(): Promise<ShipCard[]> {
  return fetchJson(`${API_URL}/api/cards/nudges`, assertShipCardArray);
}

export async function fetchCard(id: string): Promise<ShipCard> {
  return fetchJson(`${API_URL}/api/cards/${id}`, assertShipCard);
}

export async function updateCardStatus(cardId: string, status: ShipCard["status"]) {
  return postJson(`${API_URL}/api/cards/${cardId}/status`, { status }, assertOk);
}

export async function shipCard(cardId: string) {
  return postJson(`${API_URL}/api/cards/${cardId}/ship`, {}, assertOk);
}

export async function rejectCardAction(cardId: string) {
  return postJson(`${API_URL}/api/cards/${cardId}/reject`, {}, assertOk);
}

export async function fetchExplain(id: string): Promise<{
  base: number;
  averageWeight: number;
  adjustment: number;
  final: number;
  features: { feature: string; value: string; weight: number; defaultWeight: number; adjustment: number }[];
}> {
  return fetchJson(`${API_URL}/api/cards/${id}/explain`, assertExplain);
}

export async function fetchVotes(id: string): Promise<{
  minApprovers: number;
  minRejectors: number;
  votes: { direction: string; user: string }[];
}> {
  return fetchJson(`${API_URL}/api/cards/${id}/votes`, assertVotes);
}

export async function fetchComments(cardId: string): Promise<CardComment[]> {
  return fetchJson(`${API_URL}/api/cards/${cardId}/comments`, assertCardCommentArray);
}
