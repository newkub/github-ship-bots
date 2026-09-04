import { assertCheckout, assertPlanList, assertRecord } from "@ship-feed/shared";
import { API_URL, fetchJson, postJson, type Validator } from "./client";

export async function createCheckout(plan: "pro" | "team" = "pro"): Promise<{ url: string }> {
  return postJson(`${API_URL}/api/stripe/checkout`, { plan }, assertCheckout);
}

export function checkoutUrl() {
  return `${API_URL}/api/stripe/checkout`;
}

const assertPlansResponse: Validator<{ id: string; name: string; price: string; features: string[] }[]> = (value) => {
  const record = assertRecord(value, "plans response");
  return assertPlanList(record.plans);
};

export async function fetchPlans(): Promise<{ id: string; name: string; price: string; features: string[] }[]> {
  return fetchJson(`${API_URL}/api/stripe/plans`, assertPlansResponse);
}
