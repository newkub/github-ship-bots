import { createResource, Show } from "solid-js";
import { fetchSession, API_URL } from "../api";

export default function Settings() {
  const [session] = createResource(() => fetchSession());
  const webhookUrl = `${API_URL}/webhook`;

  return (
    <div>
      <h1 class="text-2xl font-bold mb-6">Settings</h1>
      <Show when={!session.loading} fallback={<div class="text-gray-500">Loading...</div>}>
        <Show when={session.error}>
          <div class="rounded-lg bg-rose-50 text-rose-700 p-4">{(session.error as Error).message}</div>
        </Show>
        <div class="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
            <input
              type="text"
              readOnly
              value={webhookUrl}
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50"
            />
            <p class="text-xs text-gray-500 mt-1">Add this URL to your GitHub App webhook settings.</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Approved label</label>
            <input type="text" readOnly value="approved" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rejected label</label>
            <input type="text" readOnly value="rejected" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50" />
          </div>
          <div class="text-xs text-gray-500">Signed in as {session()?.user?.githubLogin ?? "—"} ({session()?.user?.plan ?? "free"})</div>
        </div>
      </Show>
    </div>
  );
}
