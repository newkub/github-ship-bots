import { For, Show, createSignal } from "solid-js";
import { Eye, Send } from "lucide-solid";
import { submitInspector } from "../api";

export default function Inspector() {
  const [url, setUrl] = createSignal("");
  const [selector, setSelector] = createSignal("");
  const [prompt, setPrompt] = createSignal("");
  const [repoFullName, setRepoFullName] = createSignal("");
  const [result, setResult] = createSignal<string | null>(null);
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [selectedElement, setSelectedElement] = createSignal(".hero > h1");

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = (await submitInspector({
        url: url(),
        selector: selector(),
        prompt: prompt(),
        repoFullName: repoFullName(),
      })) as { message: string; id: string; card?: { id: string } };
      setResult(`Inspector queued: ${res.message} (card ${res.card?.id ?? res.id})`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const elements = [
    { label: "Hero headline", selector: ".hero > h1" },
    { label: "Login button", selector: "button.login" },
    { label: "Pricing card", selector: ".pricing-card" },
  ];

  return (
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Web Inspector</h1>
      <p class="text-sm text-gray-500 dark:text-zinc-400 mb-6">Capture a UI element, describe the change, and create a card from it.</p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Page URL</label>
              <input
                type="url"
                value={url()}
                onInput={(e) => setUrl(e.currentTarget.value)}
                class="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm dark:text-white"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">CSS Selector</label>
              <input
                type="text"
                value={selector()}
                onInput={(e) => setSelector(e.currentTarget.value)}
                class="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm dark:text-white"
                placeholder=".hero > h1"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Prompt</label>
              <textarea
                value={prompt()}
                onInput={(e) => setPrompt(e.currentTarget.value)}
                rows={4}
                class="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm dark:text-white"
                placeholder="Make the headline more compelling and run CI."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">Repository</label>
              <input
                type="text"
                value={repoFullName()}
                onInput={(e) => setRepoFullName(e.currentTarget.value)}
                class="w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm dark:text-white"
                placeholder="owner/repo"
              />
            </div>
            <button
              onClick={onSubmit}
              disabled={loading()}
              class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
            >
              <Show when={!loading()} fallback={<span class="animate-pulse">Submitting...</span>}>
                <Send size={16} />
                Create issue
              </Show>
            </button>
          </div>
          <Show when={result()}>
            <div class="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-sm">{result()}</div>
          </Show>
          <Show when={error()}>
            <div class="mt-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-lg text-sm">{error()}</div>
          </Show>
        </div>

        <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
          <h2 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Eye size={16} />
            Page preview
          </h2>
          <div class="rounded-xl bg-gray-50 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 h-64 p-4 relative">
            <div class="text-xs text-gray-400 dark:text-zinc-500 mb-3">{url() || "Enter a page URL and click Create issue"}</div>
            <div class="space-y-2">
              <For each={elements}>
                {(el) => (
                  <button
                    onClick={() => {
                      setSelectedElement(el.selector);
                      setSelector(el.selector);
                    }}
                    class={`text-left text-sm w-full rounded-lg px-3 py-2 border transition ${
                      selectedElement() === el.selector
                        ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300"
                        : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {el.label} — <code class="text-xs">{el.selector}</code>
                  </button>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
