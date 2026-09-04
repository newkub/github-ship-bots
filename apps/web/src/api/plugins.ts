import { API_URL, fetchJson } from "./client";

export type Plugin = { id: string; name: string; description: string; installs: number; icon: string; installed: boolean };

export async function fetchPlugins(): Promise<Plugin[]> {
  return fetchJson(`${API_URL}/api/plugins`);
}

export async function installPlugin(id: string) {
  const res = await fetch(`${API_URL}/api/plugins/${id}/install`, { method: "POST", credentials: "include" });
  if (!res.ok) throw new Error("Failed to install plugin");
  return res.json();
}

export async function uninstallPlugin(id: string) {
  const res = await fetch(`${API_URL}/api/plugins/${id}/uninstall`, { method: "POST", credentials: "include" });
  if (!res.ok) throw new Error("Failed to uninstall plugin");
  return res.json();
}
