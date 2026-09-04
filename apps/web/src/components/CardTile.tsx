import { Show } from "solid-js";
import { Check, GitPullRequest, Layers, Package, Rocket, ThumbsDown, ThumbsUp, X, GitMerge } from "lucide-solid";
import type { ShipCard, CardStatus, Impact, Risk, Effect, Phase } from "@ship-feed/shared";

const kindMeta: Record<ShipCard["kind"], { label: string; icon: typeof Layers; gradient: string; text: string; darkText: string }> = {
  idea: { label: "Idea", icon: Layers, gradient: "from-indigo-500 to-purple-600", text: "text-indigo-700", darkText: "text-indigo-300" },
  work: { label: "Work", icon: Rocket, gradient: "from-emerald-500 to-cyan-600", text: "text-emerald-700", darkText: "text-emerald-300" },
  merge: { label: "Merge", icon: GitMerge, gradient: "from-orange-500 to-rose-600", text: "text-orange-700", darkText: "text-orange-300" },
  release: { label: "Release", icon: Package, gradient: "from-purple-500 to-pink-600", text: "text-purple-700", darkText: "text-purple-300" },
};

const statusMeta: Record<CardStatus, { label: string; class: string; darkClass: string; dot: string }> = {
  pending: { label: "Pending", class: "bg-gray-100 text-gray-700", darkClass: "bg-zinc-800 text-zinc-300", dot: "bg-gray-500" },
  approved: { label: "Approved", class: "bg-emerald-100 text-emerald-700", darkClass: "bg-emerald-900/40 text-emerald-300", dot: "bg-emerald-500" },
  rejected: { label: "Rejected", class: "bg-rose-100 text-rose-700", darkClass: "bg-rose-900/40 text-rose-300", dot: "bg-rose-500" },
  shipped: { label: "Shipped", class: "bg-indigo-100 text-indigo-700", darkClass: "bg-indigo-900/40 text-indigo-300", dot: "bg-indigo-500" },
};

const impactPalette = { high: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300", medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" };
const riskPalette = { high: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300", medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300", low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" };
const effectPalette = { high: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", medium: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300", low: "bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300" };
const phasePalette = { mvp: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300", v2: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300", done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" };

const levelPill = (label: string, value: Impact | Risk | Effect | Phase, palette: Record<string, string>) => (
  <span class={`text-[10px] font-medium px-1.5 py-0.5 rounded ${palette[value] ?? palette.low}`}>{label} {value}</span>
);

function scoreStroke(score: number) {
  if (score >= 8) return "#10b981";
  if (score >= 5) return "#f59e0b";
  return "#f43f5e";
}

function ScoreRing(props: { score: number; size?: number }) {
  const size = props.size ?? 36;
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, props.score / 10));
  const dash = `${pct * circumference} ${circumference}`;

  return (
    <div class="relative flex-shrink-0" style={{ width: `${size}px`, height: `${size}px` }}>
      <svg width={size} height={size} class="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" stroke-width={stroke} class="dark:stroke-zinc-700" />
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
      <span class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-700 dark:text-zinc-200">
        {props.score.toFixed(1)}
      </span>
    </div>
  );
}

export default function CardTile(props: {
  card: ShipCard;
  onStatus: (status: CardStatus) => void;
  onDetail: () => void;
  busy: boolean;
  compact?: boolean;
}) {
  const meta = kindMeta[props.card.kind];
  const Icon = meta.icon;
  const status = statusMeta[props.card.status];

  return (
    <div
      class="group rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-4 shadow-sm hover:shadow-lg transition cursor-pointer"
      onClick={props.onDetail}
    >
      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex items-center gap-2 min-w-0">
          <div
            class={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${meta.gradient} text-white shadow-sm flex-shrink-0`}
          >
            <Icon size={18} />
          </div>
          <div class="min-w-0">
            <span class={`text-[10px] font-semibold uppercase tracking-wide ${meta.text} dark:${meta.darkText}`}>{meta.label}</span>
            <div class="text-xs text-gray-500 dark:text-zinc-400 truncate">{props.card.repoFullName}</div>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <span class={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full ${status.class} ${status.darkClass}`}>
            <span class={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
          <ScoreRing score={props.card.score} />
        </div>
      </div>

      <h3 class="text-base font-bold text-gray-900 dark:text-zinc-100 leading-tight mb-1.5 truncate" onClick={(e) => { e.stopPropagation(); props.onDetail(); }}>
        {props.card.title}
      </h3>
      <p class={`text-xs text-gray-600 dark:text-zinc-400 mb-3 ${props.card.description.length > 100 ? "line-clamp-2" : ""}`}>
        {props.card.description}
      </p>

      <div class="flex flex-wrap items-center gap-1.5 mb-3">
        {levelPill("Impact", props.card.impact, impactPalette)}
        {levelPill("Risk", props.card.risk, riskPalette)}
        {levelPill("Effect", props.card.effect, effectPalette)}
        {levelPill("Phase", props.card.phase, phasePalette)}
      </div>

      <div class="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 dark:border-zinc-800">
        <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-zinc-400">
          {props.card.issueNumber && (
            <span class="inline-flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
              <GitPullRequest size={10} /> #{props.card.issueNumber}
            </span>
          )}
          {props.card.pullNumber && (
            <span class="inline-flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
              <GitPullRequest size={10} /> PR #{props.card.pullNumber}
            </span>
          )}
        </div>

        <Show
          when={props.card.status === "pending"}
          fallback={
            <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400">
              {props.card.status === "approved" ? (
                <>
                  <Check size={14} class="text-emerald-600" /> Approved
                </>
              ) : props.card.status === "rejected" ? (
                <>
                  <X size={14} class="text-rose-600" /> Rejected
                </>
              ) : (
                <>
                  <Package size={14} class="text-indigo-600 dark:text-indigo-400" /> Shipped
                </>
              )}
            </div>
          }
        >
          <div class="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => props.onStatus("rejected")}
              disabled={props.busy}
              class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium hover:bg-rose-50 dark:hover:bg-rose-900/20 disabled:opacity-50"
            >
              <ThumbsDown size={14} /> Reject
            </button>
            <button
              onClick={() => props.onStatus("approved")}
              disabled={props.busy}
              class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 disabled:opacity-50 shadow-sm"
            >
              <ThumbsUp size={14} /> Approve
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}
