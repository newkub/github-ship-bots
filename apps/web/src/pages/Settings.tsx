import { createResource, Show, createSignal } from "solid-js";
import { Loader, AlertCircle, Copy, Check, LogOut } from "lucide-solid";
import { fetchSession, logout, API_URL } from "../api";

export default function Settings() {
  const [session] = createResource(() => fetchSession());
  const [copied, setCopied] = createSignal(false);
  const webhookUrl = `${API_URL}/webhook`;

  const copyWebhook = async () => {
    await navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
      <p class="text-sm text-gray-500 mb-6">Account, webhook, and integration settings.</p>

      <Show when={session.loading}>
        <div class="flex items-center gap-2 text-gray-500">
          <Loader size={20} class="animate-spin" />
          Loading settings…
        </div>
      </Show>

      <Show when={session.error}>
        <div class="rounded-2xl bg-rose-50 border border-rose-100 p-6 text-rose-700">
          <div class="flex items-center gap-2 mb-2">
            <AlertCircle size={20} />
            <span class="font-medium">Failed to load settings</span>
          </div>
          <p class="text-sm">{(session.error as Error).message}</p>
        </div>
      </Show>

      <Show when={!session.loading && !session.error}>
        <div class="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl space-y-6">
          <div>
            <h2 class="text-sm font-medium text-gray-900 mb-2">Account</h2>
            <div class="rounded-lg bg-gray-50 border border-gray-200 p-4 text-sm space-y-1">
              <p>
                <span class="text-gray-500">GitHub login:</span>{" "}
                <span class="font-medium text-gray-900">{session()?.user?.githubLogin ?? "—"}</span>
              </p>
              <p>
                <span class="text-gray-500">Plan:</span>{" "}
                <span class="font-medium text-gray-900 capitalize">{session()?.user?.plan ?? "free"}</span>
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
            <div class="flex gap-2">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50"
              />
              <button
                onClick={copyWebhook}
                class="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {copied() ? <Check size={16} class="text-emerald-600" /> : <Copy size={16} />}
                {copied() ? "Copied" : "Copy"}
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">Add this URL to your GitHub App webhook settings.</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Approved label</label>
              <input type="text" readOnly value="approved" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rejected label</label>
              <input type="text" readOnly value="rejected" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50" />
            </div>
          </div>

          <div class="pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </div>
      </Show>
    </div>
  );
}
