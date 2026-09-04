const DEFAULT_TIMEOUT = 10_000;

const envUrl = import.meta.env.VITE_API_URL as string | undefined;
export const API_URL = envUrl && envUrl !== "undefined" ? envUrl : (typeof window !== "undefined" ? window.location.origin : "");

if (!API_URL) throw new Error("Missing VITE_API_URL");

export type Validator<T> = (data: unknown) => T;

export async function fetchWithTimeout(url: string, init?: RequestInit, timeoutMs = DEFAULT_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, credentials: "include", signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function getErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const record = Object(data) as Record<string, unknown>;
      const message = record.message ?? record.error;
      if (typeof message === "string" && message) return message;
    }
  } catch {
    const text = await res.text().catch(() => "");
    if (text) return text;
  }
  return fallback;
}

export async function fetchJson<T>(url: string, validator: Validator<T>, init?: RequestInit, timeoutMs = DEFAULT_TIMEOUT): Promise<T> {
  const res = await fetchWithTimeout(url, init, timeoutMs);
  if (!res.ok) {
    const message = await getErrorMessage(res, `Failed to fetch ${url}`);
    throw new Error(message);
  }
  const data = await res.json() as unknown;
  return validator(data);
}

export async function postJson<T>(url: string, body: unknown, validator: Validator<T>, init?: RequestInit, timeoutMs = DEFAULT_TIMEOUT): Promise<T> {
  const res = await fetchWithTimeout(url, {
    ...init,
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }, timeoutMs);
  if (!res.ok) {
    const message = await getErrorMessage(res, `Failed to post ${url}`);
    throw new Error(message);
  }
  const data = await res.json() as unknown;
  return validator(data);
}
