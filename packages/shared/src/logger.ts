export interface ExternalCallLog {
  correlationId: string;
  service: string;
  operation: string;
  url?: string;
  method?: string;
  status?: number;
  durationMs: number;
  error?: string;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getCorrelationId(headers?: Headers | Record<string, string> | null): string {
  const h = headers && "get" in headers ? (headers as Headers).get("x-correlation-id") : (headers as Record<string, string> | null)?.["x-correlation-id"];
  return h || generateId();
}

export function logExternalCall(ctx: ExternalCallLog): void {
  console.log(JSON.stringify({ type: "external_call", ...ctx }));
}

export async function withExternalCall<T>(
  name: string,
  operation: string,
  correlationId: string,
  fn: () => Promise<{ response: T; status: number; url?: string; method?: string }>
): Promise<T> {
  const start = Date.now();
  try {
    const { response, status, url, method } = await fn();
    logExternalCall({
      correlationId,
      service: name,
      operation,
      url,
      method,
      status,
      durationMs: Date.now() - start,
    });
    return response;
  } catch (err) {
    logExternalCall({
      correlationId,
      service: name,
      operation,
      durationMs: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}

export async function fetchExternal(
  name: string,
  operation: string,
  correlationId: string,
  url: string,
  init?: RequestInit
): Promise<Response> {
  return withExternalCall(name, operation, correlationId, async () => {
    const res = await fetch(url, init);
    return { response: res, status: res.status, url, method: init?.method || "GET" };
  });
}
