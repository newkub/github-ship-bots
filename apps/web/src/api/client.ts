const envUrl = import.meta.env.VITE_API_URL as string | undefined;
export const API_URL = envUrl && envUrl !== "undefined" ? envUrl : (typeof window !== "undefined" ? window.location.origin : "");

if (!API_URL) throw new Error("Missing VITE_API_URL");

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, credentials: "include" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json() as Promise<T>;
}

export async function postJson<T>(url: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Failed to post ${url}`);
  return res.json() as Promise<T>;
}
