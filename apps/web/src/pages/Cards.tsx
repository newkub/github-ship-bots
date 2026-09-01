import { For, Show, createMemo, createSignal } from "solid-js";
import { useQuery, useQueryClient } from "@tanstack/solid-query";
import {
  Bot,
  Check,
  GitMerge,
  GitPullRequest,
  Layers,
  Package,
  Rocket,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-solid";
import type { ShipCard, CardStatus, Impact, Risk, Effect, Phase } from "@ship-feed/shared";
import { fetchCards, updateCardStatus } from "../api";

const kindMeta: Record<
  ShipCard["kind"],
  { label: string; icon: typeof Bot; gradient: string; border: string; text: string }
> = {
  idea: { label: "Idea", icon: Layers, gradient: "from-indigo-500 to-purple-600", border: "border-indigo-200", text: "text-indigo-700" },
  work: { label: "Work", icon: Rocket, gradient: "from-emerald-500 to-cyan-600", border: "border-emerald-200", text: "text-emerald-700" },
  merge: { label: "Merge", icon: GitMerge, gradient: "from-orange-500 to-rose-600", border: "border-orange-200", text: "text-orange-700" },
  release: { label: "Release", icon: Package, gradient: "from-purple-500 to-pink-600", border: "border-purple-200", text: "text-purple-700" },
};

const statusMeta: Record<CardStatus, { label: string; class: string }> = {
  pending: { label: "Pending", class: "bg-gray-100 text-gray-700" },
  approved: { label: "Approved", class: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "Rejected", class: "bg-rose-100 text-rose-700" },
  shipped: { label: "Shipped", class: "bg-indigo-100 text-indigo-700" },
};

const levelPill = (label: string, value: Impact | Risk | Effect | Phase, palette: Record<string, string>) => (
  <span class={`text-xs font-medium px-2 py-1 rounded-md ${palette[value] ?? palette.low}`}>{label} {value}</span>
);

const impactPalette = { high: "bg-rose-100 text-rose-700", medium: "bg-amber-100 text-amber-700", low: "bg-emerald-100 text-emerald-700" };
const riskPalette = { high: "bg-rose-100 text-rose-700", medium: "bg-amber-100 text-amber-700", low: "bg-emerald-100 text-emerald-700" };
const effectPalette = { high: "bg-emerald-100 text-emerald-700", medium: "bg-sky-100 text-sky-700", low: "bg-gray-100 text-gray-700" };
const phasePalette = { mvp: "bg-indigo-100 text-indigo-700", v2: "bg-purple-100 text-purple-700", done: "bg-emerald-100 text-emerald-700" };

function scoreColor(score: number) {
  if (score >= 8) return "bg-emerald-500";
  if (score >= 5) return "bg-amber-500";
  return "bg-rose-500";
}

function scoreStroke(score: number) {
  if (score >= 8) return "#10b981";
  if (score >= 5) return "#f59e0b";
  return "#f43f5e";
}

function ScoreRing(props: { score: number; size?: number }) {
  const size = props.size ?? 44;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, props.score / 10));
  const dash = `${pct * circumference} ${circumference}`;

  return (
    <div class="relative" style={{ width: `${size}px`, height: `${size}px` }}>
      <svg width={size} height={size} class="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          stroke-width={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreStroke(props.score)}
          stroke-width={stroke}
          stroke-dasharray={dash}
          stroke-linecap="round"
        />
      </svg>
      <span class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-700">
        {props.score.toFixed(1)}
      </span>
    </div>
  );
}

export default function Cards() {
  const queryClient = useQueryClient();
  const query = useQuery(() => ({ queryKey: ["cards"], queryFn: fetchCards }));
  const [filter, setFilter] = createSignal<"all" | CardStatus>("all");
  const [pendingId, setPendingId] = createSignal<string | null>(null);

  const cards = createMemo(() => {
    const data = query.data ?? [];
    if (filter() === "all") return data;
    return data.filter((c) => c.status === filter());
  });

  const onStatus = async (id: string, status: CardStatus) => {
    setPendingId(id);
    try {
      await updateCardStatus(id, status);
      await queryClient.invalidateQueries({ queryKey: ["cards"] });
    } finally {
      setPendingId(null);
    }
  };

  const counts = createMemo(() => {
    const data = query.data ?? [];
    return {
      total: data.length,
      pending: data.filter((c) => c.status === "pending").length,
      approved: data.filter((c) => c.status === "approved").length,
      shipped: data.filter((c) => c.status === "shipped").length,
    };
  });

  return (
    <div>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Cards</h1>
          <p class="text-sm text-gray-500 mt-1">
            {counts().pending} pending &middot; {counts().approved} approved &middot; {counts().shipped} shipped &middot; {counts().total} total
          </p>
        </div>
        <div class="flex items-center gap-2">
          <For each={["all", "pending", "approved", "rejected", "shipped"] as const}>
            {(key) => (
              <button
                onClick={() => setFilter(key)}
                class={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  filter() === key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {key[0]!.toUpperCase() + key.slice(1)}
              </button>
            )}
          </For>
        </div>
      </div>

      <Show when={!query.isLoading} fallback={<p class="text-gray-500">Loading cards...</p>}>
        <Show
          when={query.error}
          fallback={
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <For each={cards()}>
                {(card) => {
                  const meta = kindMeta[card.kind];
                  const Icon = meta.icon;
                  const isPending = card.status === "pending";
                  const busy = pendingId() === card.id;

                  return (
                    <div class="group rounded-2xl bg-white border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition">
                      <div class="flex items-start justify-between gap-4 mb-4">
                        <div class="flex items-center gap-3">
                          <div
                            class={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-sm`}
                          >
                            <Icon size={20} />
                          </div>
                          <div>
                            <span class={`text-xs font-semibold uppercase tracking-wide ${meta.text}`}>{meta.label}</span>
                            <div class="text-sm text-gray-500">{card.repoFullName}</div>
                          </div>
                        </div>
                        <div class="flex items-center gap-3">
                          <span class={`text-xs font-medium px-2.5 py-1 rounded-full ${statusMeta[card.status].class}`}>
                            {statusMeta[card.status].label}
                          </span>
                          <ScoreRing score={card.score} />
                        </div>
                      </div>

                      <h3 class="text-lg font-bold text-gray-900 leading-tight mb-2">{card.title}</h3>
                      <p class={`text-sm text-gray-600 mb-4 ${card.description.length > 120 ? "line-clamp-2" : ""}`}>
                        {card.description}
                      </p>

                      <div class="flex flex-wrap items-center gap-2 mb-4">
                        {levelPill("Impact", card.impact, impactPalette)}
                        {levelPill("Risk", card.risk, riskPalette)}
                        {levelPill("Effect", card.effect, effectPalette)}
                        {levelPill("Phase", card.phase, phasePalette)}
                        {card.issueNumber && (
                          <span class="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                            <GitPullRequest size={12} /> #{card.issueNumber}
                          </span>
                        )}
                        {card.pullNumber && (
                          <span class="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                            <GitPullRequest size={12} /> PR #{card.pullNumber}
                          </span>
                        )}
                      </div>

                      <div class="flex items-center justify-between gap-3 pt-4 border-t border-gray-100">
                        <Show
                          when={isPending}
                          fallback={
                            <div class="flex items-center gap-2 text-sm text-gray-500">
                              {card.status === "approved" ? (
                                <>
                                  <Check size={16} class="text-emerald-600" /> Approved
                                </>
                              ) : card.status === "rejected" ? (
                                <>
                                  <X size={16} class="text-rose-600" /> Rejected
                                </>
                              ) : (
                                <>
                                  <Package size={16} class="text-indigo-600" /> Shipped
                                </>
                              )}
                            </div>
                          }
                        >
                          <div class="flex items-center gap-2">
                            <button
                              onClick={() => onStatus(card.id, "rejected")}
                              disabled={busy}
                              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-rose-200 text-rose-700 text-sm font-medium hover:bg-rose-50 disabled:opacity-50"
                            >
                              <ThumbsDown size={16} /> Reject
                            </button>
                            <button
                              onClick={() => onStatus(card.id, "approved")}
                              disabled={busy}
                              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 shadow-sm"
                            >
                              <ThumbsUp size={16} /> Approve
                            </button>
                          </div>
                        </Show>
                      </div>
                    </div>
                  );
                }}
              </For>
            </div>
          }
        >
          <div class="rounded-2xl bg-rose-50 border border-rose-100 p-6 text-rose-700">
            <p>Failed to load cards. Is the API running?</p>
          </div>
        </Show>
      </Show>

      <Show when={!query.isLoading && cards().length === 0}>
        <div class="rounded-2xl bg-white border border-gray-200 p-10 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 mb-4">
            <Package size={24} />
          </div>
          <h3 class="text-lg font-medium text-gray-900">No cards yet</h3>
          <p class="text-sm text-gray-500 mt-1">Open an issue or pull request to see it here.</p>
        </div>
      </Show>
    </div>
  );
}
