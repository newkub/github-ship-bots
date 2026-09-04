import { API_URL, fetchJson } from "./client";

export type ShipConfig = {
  appUrl: string;
  githubAppName: string;
  autoApproveThreshold: number;
  autoApproveRisk: string;
};

export async function fetchConfig(): Promise<ShipConfig> {
  return fetchJson(`${API_URL}/api/config`);
}
