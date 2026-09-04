const DEFAULT_TIMEOUT = 10_000;

const envUrl = import.meta.env.VITE_API_URL as string | undefined;
export const API_URL = envUrl && envUrl !== "undefined" ? envUrl : (typeof window !== "undefined" ? window.location.origin : "");

if (!API_URL) throw new Error("Missing VITE_API_URL");

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

export async function fetchJson<T>(url: string, init?: RequestInit, timeoutMs = DEFAULT_TIMEOUT): Promise<T> {
  const res = await fetchWithTimeout(url, init, timeoutMs);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json() as Promise<T>;
}

export async function postJson<T>(url: string, body: unknown, init?: RequestInit, timeoutMs = DEFAULT_TIMEOUT): Promise<T> {
  const res = await fetchWithTimeout(url, {
    ...init,
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }, timeoutMs);
  if (!res.ok) throw new Error(`Failed to post ${url}`);
  return res.json() as Promise<T>;
}
