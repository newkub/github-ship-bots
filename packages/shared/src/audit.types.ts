export interface RefactorArtifact {
  id: string;
  cardId: string;
  diffKey: string;
  status: "pending" | "applied" | "rejected";
  createdAt: string;
}

export interface IssueTrace {
  id: string;
  issueId: string;
  cardId?: string;
  event: string;
  detail: string;
  createdAt: string;
}

export interface CiDiagnostic {
  id: string;
  cardId?: string;
  runId: string;
  logKey: string;
  diagnosis: string;
  createdAt: string;
}

export interface UsageEvent {
  id: string;
  userId?: string;
  event: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
