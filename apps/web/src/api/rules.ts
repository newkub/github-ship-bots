import type { ApprovalRule } from "@ship-feed/shared";
import { assertApprovalRule } from "@ship-feed/shared";
import { API_URL, fetchJson, postJson } from "./client";

export async function fetchRule(repo: string): Promise<ApprovalRule> {
  return fetchJson(`${API_URL}/api/rules?repo=${encodeURIComponent(repo)}`, assertApprovalRule);
}

export async function setRule(rule: ApprovalRule): Promise<ApprovalRule> {
  return postJson(`${API_URL}/api/rules`, rule, assertApprovalRule);
}
