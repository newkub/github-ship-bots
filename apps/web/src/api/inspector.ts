import { API_URL, postJson } from "./client";

export async function submitInspector(data: { url: string; selector: string; prompt: string; repoFullName: string }) {
  return postJson(`${API_URL}/api/inspector`, data);
}
