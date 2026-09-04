import { getCorrelationId, logError, logWarn, logInfo } from "@ship-feed/shared";

export interface LogContext {
  correlationId?: string;
  [key: string]: unknown;
}

function structured(level: string, message: string, ctx: LogContext = {}) {
  const correlationId = ctx.correlationId ?? getCorrelationId();
  const payload = { level, message, correlationId, ...ctx, timestamp: new Date().toISOString() };
  if (level === "error") {
    logError(payload);
  } else if (level === "warn") {
    logWarn(payload);
  } else {
    logInfo(payload);
  }
}

export const logger = {
  info: (message: string, ctx?: LogContext) => structured("info", message, ctx),
  warn: (message: string, ctx?: LogContext) => structured("warn", message, ctx),
  error: (message: string, ctx?: LogContext) => structured("error", message, ctx),
};
