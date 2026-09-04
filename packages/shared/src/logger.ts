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
  const c = typeof crypto !== "undefined" ? (crypto as unknown as Crypto) : undefined;
  if (c && "randomUUID" in c) {
    return c.randomUUID();
  }
  const bytes = new Uint8Array(16);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function getHeaderValue(headers: unknown, name: string): string | null | undefined {
  if (!headers) return undefined;
  if (headers instanceof Headers) {
    return headers.get(name) ?? undefined;
  }
  if (typeof headers === "object" && headers !== null && !Array.isArray(headers)) {
    const record = headers as Record<string, string | undefined>;
    for (const key of Object.keys(record)) {
      if (key.toLowerCase() === name.toLowerCase()) return record[key];
    }
  }
  return undefined;
}

export function getCorrelationId(headers?: Headers | Record<string, string> | null): string {
  return getHeaderValue(headers, "x-correlation-id") || generateId();
}

export function logError(ctx: Record<string, unknown>): void {
  console.error(JSON.stringify({ type: "error", ...ctx }));
}

export function logWarn(ctx: Record<string, unknown>): void {
  console.warn(JSON.stringify({ type: "warn", ...ctx }));
}

export function logInfo(ctx: Record<string, unknown>): void {
  console.log(JSON.stringify({ type: "info", ...ctx }));
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
