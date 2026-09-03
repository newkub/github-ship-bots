export type PlanTier = "free" | "pro" | "team";

export interface User {
  id: string;
  githubLogin: string;
  email?: string;
  workosUserId?: string;
  plan: PlanTier;
  stripeCustomerId?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  plan: PlanTier;
  status: "active" | "trialing" | "past_due" | "canceled";
  currentPeriodEnd: string;
}
