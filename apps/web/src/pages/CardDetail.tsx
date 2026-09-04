import { Show, For, createSignal, createResource } from "solid-js";
import { X, FileText, MessageSquare, Image, Video, FileCode, Tag } from "lucide-solid";
import { API_URL, fetchCard, fetchComments, fetchEvidence, fetchEvidenceContent, fetchExplain, fetchTemplates, fetchVotes, applyTemplate } from "../api";
import type { ShipCard } from "@ship-feed/shared";

export default function CardDetail(props: { cardId: string; onClose: () => void }) {
  const [card] = createResource(() => props.cardId, fetchCard);
  const [tagFilter, setTagFilter] = createSignal("");
  const [evidence] = createResource(
    () => ({ cardId: props.cardId, tags: tagFilter().split(",").map((t) => t.trim()).filter(Boolean) }),
    ({ cardId, tags }) => fetchEvidence(cardId, tags)
  );
  const [explain] = createResource(() => props.cardId, fetchExplain);
  const [votes] = createResource(() => props.cardId, fetchVotes);
  const [comments, { refetch: refetchComments }] = createResource(() => props.cardId, fetchComments);
  const [templates] = createResource(() => card()?.repoFullName, fetchTemplates);
  const [activeEvidence, setActiveEvidence] = createSignal<string | null>(null);
  const [activeKind, setActiveKind] = createSignal<string>("");
  const [content] = createResource(activeEvidence, fetchEvidenceContent);

  const selectEvidence = (id: string, kind: string) => {
    setActiveEvidence(id);
    setActiveKind(kind);
  };

  return (
    <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center p-4">
      <div class="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-800">
        <Show when={card.loading}>
          <div class="p-6 text-gray-500 dark:text-zinc-400 flex items-center gap-2"><span class="animate-pulse">Loading...</span></div>
        </Show>
        <Show when={card.error}>
          <div class="p-6 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300">
            <div class="font-semibold">Failed to load card</div>
            <div class="text-sm mt-1">{(card.error as Error).message}</div>
          </div>
        </Show>
        <Show when={card()} fallback={<></>} keyed>
          {(c: ShipCard) => (
            <div>
              <div class="p-6 border-b border-gray-100 dark:border-zinc-800 flex items-start justify-between sticky top-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur z-10">
                <div class="min-w-0">
                  <h2 class="text-xl font-bold text-gray-900 dark:text-zinc-100">{c.title}</h2>
                  <p class="text-sm text-gray-500 dark:text-zinc-400 mt-1">{c.repoFullName}</p>
                </div>
                <button onClick={props.onClose} class="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition shrink-0">
                  <X size={20} />
                </button>
              </div>

              <div class="p-6 space-y-6">
                <p class="text-gray-700 dark:text-zinc-300 text-sm leading-relaxed">{c.description}</p>

                <div class="grid grid-cols-4 gap-2 text-center text-xs">
                  <Metric label="score" value={c.score.toFixed(2)} />
                  <Metric label="impact" value={c.impact} />
                  <Metric label="risk" value={c.risk} />
                  <Metric label="effect" value={c.effect} />
                </div>

                <Show when={explain()}>
                  <div class="rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-4">
                    <h3 class="font-semibold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2"><FileText size={16} /> Why this score?</h3>
                    <p class="text-sm text-indigo-800 dark:text-indigo-200 mb-3">
                      Base <strong>{explain()!.base}</strong> + adjustment <strong>{explain()!.adjustment}</strong> = <strong>{explain()!.final}</strong>
                    </p>
                    <ul class="space-y-1 text-sm text-indigo-900 dark:text-indigo-200">
                      <For each={explain()!.features}>
                        {(f) => (
                          <li class="flex items-center justify-between bg-white/60 dark:bg-zinc-900/40 rounded-lg px-3 py-2">
                            <span class="capitalize">{f.feature}: <span class="text-gray-600 dark:text-zinc-400">{f.value}</span></span>
                            <span class={f.adjustment >= 0 ? "text-emerald-600" : "text-rose-600"}>
                              {f.adjustment >= 0 ? "+" : ""}{f.adjustment}
                            </span>
                          </li>
                        )}
                      </For>
                    </ul>
                  </div>
                </Show>

                <Show when={votes()}>
                  <div class="rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-4">
                    <h3 class="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                      Approval chain {votes()!.votes.filter((v) => v.direction === "approve").length}/{votes()!.minApprovers}
                    </h3>
                    <ul class="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                      <For each={votes()!.votes}>
                        {(v) => (
                          <li class="flex items-center justify-between bg-white dark:bg-zinc-900 rounded-lg px-3 py-2 border border-zinc-100 dark:border-zinc-800">
                            <span class="text-zinc-500 dark:text-zinc-400">{v.user ?? "Unknown"}</span>
                            <span class={v.direction === "approve" ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                              {v.direction}
                            </span>
                          </li>
                        )}
                      </For>
                    </ul>
                  </div>
                </Show>

                <Show when={templates() && templates()!.length > 0}>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-zinc-100 mb-2 flex items-center gap-2"><MessageSquare size={16} /> Quick comment</h3>
                    <div class="flex flex-wrap gap-2">
                      <For each={templates()}>
                        {(t) => (
                          <button
                            onClick={async () => {
                              await applyTemplate(t.id, props.cardId);
                              await refetchComments();
                            }}
                            class="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition"
                          >
                            {t.name}
                          </button>
                        )}
                      </For>
                    </div>
                  </div>
                </Show>

                <Show when={comments() && comments()!.length > 0}>
                  <div>
                    <h3 class="font-semibold text-gray-900 dark:text-zinc-100 mb-2 flex items-center gap-2"><MessageSquare size={16} /> Comments</h3>
                    <ul class="space-y-2">
                      <For each={comments() ?? []}>
                        {(comment) => (
                          <li class="rounded-lg bg-gray-50 dark:bg-zinc-900/60 border border-gray-100 dark:border-zinc-800 p-3 text-sm">
                            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400 mb-1">
                              <span>{comment.user ?? "You"}</span>
                              {comment.postedToGitHub && <span class="text-emerald-600">GitHub</span>}
                            </div>
                            <p class="text-gray-700 dark:text-zinc-300 whitespace-pre-line">{comment.body}</p>
                          </li>
                        )}
                      </For>
                    </ul>
                  </div>
                </Show>

                <div>
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="font-semibold text-gray-900 dark:text-zinc-100 flex items-center gap-2"><FileCode size={16} /> Evidence</h3>
                    <div class="flex items-center gap-2">
                      <Tag size={14} class="text-gray-400" />
                      <input
                        type="text"
                        value={tagFilter()}
                        onInput={(e) => setTagFilter(e.currentTarget.value)}
                        placeholder="Filter by tag"
                        class="text-xs rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1 dark:text-white"
                      />
                    </div>
                  </div>
                  <Show when={evidence.loading}>
                    <p class="text-sm text-gray-500 dark:text-zinc-400">Loading evidence…</p>
                  </Show>
                  <Show when={evidence.error}>
                    <div class="rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 p-3 text-sm text-rose-700 dark:text-rose-300">
                      Failed to load evidence: {(evidence.error as Error).message}
                    </div>
                  </Show>
                  <Show when={!evidence.loading && !evidence.error}>
                    <Show when={evidence() && evidence()!.length > 0} fallback={<p class="text-sm text-gray-500 dark:text-zinc-400">No evidence yet.</p>}>
                      <ul class="space-y-2">
                        <For each={evidence() ?? []}>
                          {(item) => {
                            const Icon = item.kind === "image" ? Image : item.kind === "video" ? Video : FileCode;
                            return (
                              <li>
                                <button
                                  onClick={() => selectEvidence(item.id, item.kind)}
                                  class={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm transition ${
                                    activeEvidence() === item.id
                                      ? "bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800"
                                      : "bg-gray-50 dark:bg-zinc-900/60 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                  }`}
                                >
                                  <Icon size={14} class="text-gray-400" />
                                  <span class="capitalize font-medium">{item.kind}</span>
                                  <span class="text-gray-400 dark:text-zinc-500 ml-2 font-mono text-xs">{(item.sha256 ?? "").slice(0, 12)}</span>
                                  <Show when={item.tags.length > 0}>
                                    <span class="ml-auto flex items-center gap-1">
                                      <For each={item.tags}>
                                        {(tag) => (
                                          <span class="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                                            {tag}
                                          </span>
                                        )}
                                      </For>
                                    </span>
                                  </Show>
                                </button>
                              </li>
                            );
                          }}
                        </For>
                      </ul>
                    </Show>
                  </Show>

                  <Show when={activeEvidence()}>
                    <div class="mt-4 rounded-lg bg-gray-900 text-gray-100 p-4 overflow-x-auto">
                      <Show when={activeKind() === "image"}>
                        <img
                          src={`${API_URL}/api/evidence/${activeEvidence()}`}
                          alt="evidence"
                          class="max-w-full rounded"
                        />
                      </Show>
                      <Show when={activeKind() === "video"}>
                        <video
                          src={`${API_URL}/api/evidence/${activeEvidence()}`}
                          controls
                          class="max-w-full rounded"
                        />
                      </Show>
                      <Show when={activeKind() !== "image" && activeKind() !== "video"}>
                        <Show when={content.error}>
                          <p class="text-sm text-rose-300">Failed to load content: {(content.error as Error).message}</p>
                        </Show>
                        <Show when={content.loading}>
                          <p class="text-sm text-zinc-400">Loading content…</p>
                        </Show>
                        <Show when={!content.loading && !content.error}>
                          <pre class="text-xs whitespace-pre-wrap">{content()}</pre>
                        </Show>
                      </Show>
                    </div>
                  </Show>
                </div>
              </div>
            </div>
          )}
        </Show>
      </div>
    </div>
  );
}

function Metric(props: { label: string; value: string }) {
  return (
    <div class="bg-gray-100 dark:bg-zinc-900/60 rounded-lg p-2 border border-gray-200 dark:border-zinc-800">
      <div class="uppercase tracking-wider text-gray-500 dark:text-zinc-400 text-[10px] mb-1">{props.label}</div>
      <div class="font-semibold capitalize text-gray-900 dark:text-zinc-100">{props.value}</div>
    </div>
  );
}
