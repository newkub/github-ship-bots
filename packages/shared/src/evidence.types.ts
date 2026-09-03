export interface EvidenceRecord {
  id: string;
  cardId: string;
  kind: "image" | "video" | "log" | "diff";
  r2Key: string;
  sha256: string;
  ciRunUrl?: string;
  createdAt: string;
}

export interface TestOracleBaseline {
  id: string;
  repoFullName: string;
  name: string;
  r2Key: string;
  sha256: string;
  createdAt: string;
}

export interface TestOracleResult {
  id: string;
  baselineId: string;
  cardId: string;
  diffScore: number;
  passed: boolean;
  r2DiffKey?: string;
  createdAt: string;
}
