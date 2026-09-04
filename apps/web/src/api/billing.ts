import { API_URL, fetchJson, postJson } from "./client";

export async function createCheckout(plan: "pro" | "team" = "pro"): Promise<{ url: string }> {
  return postJson(`${API_URL}/api/stripe/checkout`, { plan });
}

export function checkoutUrl() {
  return `${API_URL}/api/stripe/checkout`;
}

export async function fetchPlans(): Promise<{ id: string; name: string; price: string; features: string[] }[]> {
  const data = await fetchJson<{ plans: { id: string; name: string; price: string; features: string[] }[] }>(`${API_URL}/api/stripe/plans`);
  return data.plans;
}
