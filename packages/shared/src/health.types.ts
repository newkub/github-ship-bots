export interface HealthCheck {
  id: string;
  status: "healthy" | "degraded" | "unhealthy";
  metrics: Record<string, number>;
  runAt: string;
}

export interface VoiceCommand {
  id: string;
  userId: string;
  audioKey?: string;
  transcript: string;
  action: string;
  createdAt: string;
}
