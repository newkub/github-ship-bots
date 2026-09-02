import { For, Show, createSignal } from "solid-js";
import { Check, Code, Eye, FileCode, Lightbulb, Send, Sparkles, X } from "lucide-solid";
import { submitInspector } from "../api";

export default function Inspector() {
  const [url, setUrl] = createSignal("");
  const [selector, setSelector] = createSignal("");
  const [prompt, setPrompt] = createSignal("");
  const [repoFullName, setRepoFullName] = createSignal("");
  const [result, setResult] = createSignal<string | null>(null);
  const [showRealize, setShowRealize] = createSignal(false);
  const [realizeTab, setRealizeTab] = createSignal<"plan" | "diff" | "tests">("plan");
  const [suggestion, setSuggestion] = createSignal<string | null>(null);
  const [selectedElement, setSelectedElement] = createSignal(".hero > h1");

  const onSubmit = async () => {
    const res = await submitInspector({
      url: url(),
      selector: selector(),
      prompt: prompt(),
      repoFullName: repoFullName(),
    });
    setResult(`Inspector queued: ${JSON.stringify(res)}`);
    setSuggestion("Consider using an early return pattern here.");
    setShowRealize(true);
  };

  const elements = [
    { label: "Hero headline", selector: ".hero > h1" },
    { label: "Login button", selector: "button.login" },
    { label: "Pricing card", selector: ".pricing-card" },
  ];

  return (
    <div>
      <h1 class="text-2xl font-bold mb-6">Web Inspector</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div class="bg-white rounded-2xl border border-gray-200 p-6">
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
              class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              <Send size={16} />
              Create issue
            </button>
          </div>
          {result() && (
            <div class="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700">{result()}</div>
          )}
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 class="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Eye size={16} />
            Page preview
          </h2>
          <div class="rounded-xl bg-gray-50 border border-gray-200 h-64 p-4 relative">
            <div class="text-xs text-gray-400 mb-3">{url() || "https://example.com"}</div>
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
                        ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {el.label} — <code class="text-xs">{el.selector}</code>
                  </button>
                )}
              </For>
            </div>
          </div>

          <Show when={suggestion()}>
            <div class="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-4">
              <div class="flex items-start gap-3">
                <Lightbulb size={18} class="text-amber-600 shrink-0" />
                <div class="flex-1">
                  <p class="text-sm text-amber-900">{suggestion()}</p>
                  <div class="mt-2 flex gap-2">
                    <button class="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-700">Insert comment</button>
                    <button onClick={() => setSuggestion(null)} class="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50">Dismiss</button>
                  </div>
                </div>
              </div>
            </div>
          </Show>
        </div>
      </div>

      <Show when={showRealize()}>
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 class="text-lg font-bold flex items-center gap-2">
                <Sparkles size={18} class="text-indigo-500" />
                Realize Implementation
              </h2>
              <button onClick={() => setShowRealize(false)} class="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <div class="p-6">
              <div class="flex items-center gap-2 mb-4 border-b border-gray-200 pb-1">
                <TabButton active={realizeTab() === "plan"} onClick={() => setRealizeTab("plan")} icon={FileCode} label="Plan" />
                <TabButton active={realizeTab() === "diff"} onClick={() => setRealizeTab("diff")} icon={Code} label="Diff" />
                <TabButton active={realizeTab() === "tests"} onClick={() => setRealizeTab("tests")} icon={Check} label="Tests" />
              </div>

              <div class="rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-700 min-h-32">
                {realizeTab() === "plan" && (
                  <ul class="list-disc pl-4 space-y-1">
                    <li>Refactor headline component to accept variants.</li>
                    <li>Update copy on landing hero.</li>
                    <li>Run visual diff test.</li>
                  </ul>
                )}
                {realizeTab() === "diff" && (
                  <pre class="text-xs overflow-auto">
{`+ export const headline = "Ship faster with AI";
- export const headline = "Welcome";`}
                  </pre>
                )}
                {realizeTab() === "tests" && (
                  <ul class="list-disc pl-4 space-y-1">
                    <li>renders hero with new copy</li>
                    <li>preserves baseline visual diff</li>
                  </ul>
                )}
              </div>

              <div class="mt-4 flex items-center justify-between">
                <div class="text-xs text-gray-500">
                  confidence 94% · risk low
                </div>
                <div class="flex gap-2">
                  <button onClick={() => setShowRealize(false)} class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700">Implement</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}

function TabButton(props: {
  active: boolean;
  onClick: () => void;
  icon: typeof FileCode;
  label: string;
}) {
  const Icon = props.icon;
  return (
    <button
      onClick={props.onClick}
      class={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition ${
        props.active
          ? "border-indigo-500 text-indigo-600"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      <Icon size={14} />
      {props.label}
    </button>
  );
}
