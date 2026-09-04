import type { CommentTemplate } from "@ship-feed/shared";
import { assertCommentTemplate, assertCommentTemplateArray, assertOk } from "@ship-feed/shared";
import { API_URL, fetchJson, postJson } from "./client";

export async function fetchTemplates(repo?: string): Promise<CommentTemplate[]> {
  const url = repo ? `${API_URL}/api/templates?repo=${encodeURIComponent(repo)}` : `${API_URL}/api/templates`;
  return fetchJson(url, assertCommentTemplateArray);
}

export async function createTemplate(data: { name: string; body: string; repoFullName?: string }) {
  return postJson(`${API_URL}/api/templates`, data, assertCommentTemplate);
}

export async function applyTemplate(templateId: string, cardId: string) {
  return postJson(`${API_URL}/api/templates/${templateId}/comment`, { cardId }, assertOk);
}
