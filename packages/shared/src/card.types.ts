export type CardKind = "idea" | "work" | "merge" | "release";
export type CardStatus = "pending" | "approved" | "rejected" | "shipped";
export type Impact = "high" | "medium" | "low";
export type Risk = "high" | "medium" | "low";
export type Effect = "high" | "medium" | "low";
export type Phase = "mvp" | "v2" | "done";

export interface ShipCard {
  id: string;
  kind: CardKind;
  title: string;
  description: string;
  status: CardStatus;
  repoFullName: string;
  issueNumber?: number;
  pullNumber?: number;
  impact: Impact;
  risk: Risk;
  effect: Effect;
  phase: Phase;
  score: number;
  evidenceIds: string[];
  creatorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SwipeEvent {
  id: string;
  cardId: string;
  userId: string;
  direction: "approve" | "reject";
  createdAt: string;
}
