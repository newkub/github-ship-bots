export interface AgentSdk {
  id: string;
  userId: string;
  name: string;
  token: string;
  config: Record<string, unknown>;
  createdAt: string;
}

export interface NotificationChannel {
  id: string;
  userId: string;
  provider: "slack" | "discord" | "telegram";
  channel: string;
  webhook: string;
  createdAt: string;
}
