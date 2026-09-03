export interface LearningWeight {
  repoFullName: string;
  feature: string;
  weight: number;
  updatedAt: string;
}

export interface ApprovalRule {
  repoFullName: string;
  minApprovers: number;
  minRejectors: number;
  updatedAt: string;
}
