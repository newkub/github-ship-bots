import { API_URL, postJson } from "./client";

export async function createCheckout(plan: "pro" | "team" = "pro"): Promise<{ url: string }> {
  return postJson(`${API_URL}/api/stripe/checkout`, { plan });
}
