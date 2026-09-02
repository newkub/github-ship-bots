import { Show, For, createSignal, createResource } from "solid-js";
import { fetchCard, fetchComments, fetchEvidence, fetchEvidenceContent, fetchExplain, fetchTemplates, fetchVotes, applyTemplate } from "../api";
import type { ShipCard } from "@ship-feed/shared";

const API_URL = import.meta.env.VITE_API_URL || "https://github-ship-bots.newkubise.workers.dev";

export default function CardDetail(props: { cardId: string; onClose: () => void }) {
  const [card] = createResource(() => props.cardId, fetchCard);
  const [evidence] = createResource(() => props.cardId, fetchEvidence);
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
      <div class="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <Show when={card()} fallback={<div class="p-6 text-gray-500">Loading...</div>} keyed>
          {(c: ShipCard) => (
            <div>
              <div class="p-6 border-b border-gray-100 flex items-start justify-between">
                <div>
                  <h2 class="text-xl font-bold text-gray-900">{c.title}</h2>
                  <p class="text-sm text-gray-500 mt-1">{c.repoFullName}</p>
                </div>
                <button onClick={props.onClose} class="text-gray-400 hover:text-gray-600">
                  Close
                </button>
              </div>

              <div class="p-6 space-y-6">
                <p class="text-gray-700 text-sm leading-relaxed">{c.description}</p>

                <div class="grid grid-cols-4 gap-2 text-center text-xs">
                  <Metric label="score" value={c.score.toFixed(2)} />
                  <Metric label="impact" value={c.impact} />
                  <Metric label="risk" value={c.risk} />
                  <Metric label="effect" value={c.effect} />
                </div>

                <Show when={explain()}>
                  <div class="rounded-xl bg-indigo-50 border border-indigo-100 p-4">
                    <h3 class="font-semibold text-indigo-900 mb-2">Why this score?</h3>
                    <p class="text-sm text-indigo-800 mb-3">
                      Base <strong>{explain()!.base}</strong> + adjustment <strong>{explain()!.adjustment}</strong> = <strong>{explain()!.final}</strong>
                    </p>
                    <ul class="space-y-1 text-sm text-indigo-900">
                      <For each={explain()!.features}>
                        {(f) => (
                          <li class="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2">
                            <span class="capitalize">{f.feature}: <span class="text-gray-600">{f.value}</span></span>
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
                  <div class="rounded-xl bg-zinc-50 border border-zinc-200 p-4">
                    <h3 class="font-semibold text-zinc-900 mb-2">
                      Approval chain {votes()!.votes.filter((v) => v.direction === "approve").length}/{votes()!.minApprovers}
                    </h3>
                    <ul class="space-y-1 text-sm text-zinc-700">
                      <For each={votes()!.votes}>
                        {(v) => (
                          <li class="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-zinc-100">
                            <span class="text-zinc-500">{v.user ?? "Unknown"}</span>
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
                    <h3 class="font-semibold text-gray-900 mb-2">Quick comment</h3>
                    <div class="flex flex-wrap gap-2">
                      <For each={templates()}>
                        {(t) => (
                          <button
                            onClick={async () => {
                              await applyTemplate(t.id, props.cardId);
                              await refetchComments();
                            }}
                            class="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium hover:bg-indigo-100 transition"
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
                    <h3 class="font-semibold text-gray-900 mb-2">Comments</h3>
                    <ul class="space-y-2">
                      <For each={comments() ?? []}>
                        {(comment) => (
                          <li class="rounded-lg bg-gray-50 border border-gray-100 p-3 text-sm">
                            <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                              <span>{comment.user ?? "You"}</span>
                              {comment.postedToGitHub && <span class="text-emerald-600">GitHub</span>}
                            </div>
                            <p class="text-gray-700 whitespace-pre-line">{comment.body}</p>
                          </li>
                        )}
                      </For>
                    </ul>
                  </div>
                </Show>

                <div>
                  <h3 class="font-semibold text-gray-900 mb-3">Evidence</h3>
                  <Show when={evidence() && evidence()!.length > 0} fallback={<p class="text-sm text-gray-500">No evidence yet.</p>}>
                    <ul class="space-y-2">
                      <For each={evidence() ?? []}>
                        {(item) => (
                          <li>
                            <button
                              onClick={() => selectEvidence(item.id as string, item.kind as string)}
                              class={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                                activeEvidence() === item.id ? "bg-indigo-50 border border-indigo-200" : "bg-gray-50 hover:bg-gray-100"
                              }`}
                            >
                              <span class="capitalize font-medium">{item.kind as string}</span>
                              <span class="text-gray-400 ml-2 font-mono text-xs">{((item.sha256 as string) ?? "").slice(0, 12)}</span>
                            </button>
                          </li>
                        )}
                      </For>
                    </ul>
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
                        <pre class="text-xs whitespace-pre-wrap">{content() || "Loading..."}</pre>
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
    <div class="bg-gray-100 rounded-lg p-2">
      <div class="uppercase tracking-wider text-gray-500 text-[10px] mb-1">{props.label}</div>
      <div class="font-semibold capitalize text-gray-900">{props.value}</div>
    </div>
  );
}
