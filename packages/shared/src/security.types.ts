export interface SecurityFinding {
  id: string;
  cardId?: string;
  repoFullName: string;
  type: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  description: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface RollbackEvent {
  id: string;
  cardId: string;
  deploymentId?: string;
  reason: string;
  success: boolean;
  rolledBackAt: string;
  createdAt: string;
}
