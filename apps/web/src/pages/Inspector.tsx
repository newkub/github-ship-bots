import { createSignal } from "solid-js";
import { submitInspector } from "../api";

export default function Inspector() {
  const [url, setUrl] = createSignal("");
  const [selector, setSelector] = createSignal("");
  const [prompt, setPrompt] = createSignal("");
  const [repoFullName, setRepoFullName] = createSignal("");
  const [result, setResult] = createSignal<string | null>(null);

  const onSubmit = async () => {
    const res = await submitInspector({
      url: url(),
      selector: selector(),
      prompt: prompt(),
      repoFullName: repoFullName(),
    });
    setResult(`Inspector queued: ${JSON.stringify(res)}`);
  };

  return (
    <div>
      <h1 class="text-2xl font-bold mb-6">Web Inspector</h1>
      <div class="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Page URL</label>
            <input
              type="url"
              value={url()}
              onInput={(e) => setUrl(e.currentTarget.value)}
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">CSS Selector</label>
            <input
              type="text"
              value={selector()}
              onInput={(e) => setSelector(e.currentTarget.value)}
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder=".hero > h1"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
            <textarea
              value={prompt()}
              onInput={(e) => setPrompt(e.currentTarget.value)}
              rows={4}
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="Make the headline more compelling and run CI."
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Repository</label>
            <input
              type="text"
              value={repoFullName()}
              onInput={(e) => setRepoFullName(e.currentTarget.value)}
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="owner/repo"
            />
          </div>
          <button
            onClick={onSubmit}
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Send to ship-feed
          </button>
        </div>
        {result() && (
          <div class="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700">{result()}</div>
        )}
      </div>
    </div>
  );
}
