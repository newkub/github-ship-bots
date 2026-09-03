import { PreviewCard, kindMeta, statusMeta, impactPalette, riskPalette } from "./data";
import ScoreRing from "./ScoreRing";

export default function MiniCard(props: { card: PreviewCard }) {
  const meta = kindMeta[props.card.kind];
  const Icon = meta.icon;
  const status = statusMeta[props.card.status];
  return (
    <div class="rounded-xl bg-zinc-950 border border-zinc-800 p-3 hover:border-indigo-500/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 transition duration-300 group">
      <div class="flex items-start justify-between gap-2 mb-2">
        <div class="flex items-center gap-2 min-w-0">
          <div class={`h-8 w-8 rounded-lg flex items-center justify-center ${meta.class}`}>
            <Icon size={16} />
          </div>
          <div class="min-w-0">
            <div class="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
              {meta.label}
            </div>
            <div class="text-xs text-zinc-500 truncate">{props.card.repo}</div>
          </div>
        </div>
        <ScoreRing score={props.card.score} size={28} />
      </div>

      <h4 class="text-sm font-semibold text-white mb-1.5 truncate">
        {props.card.title}
      </h4>

      <div class="flex flex-wrap items-center gap-1.5 mb-2.5">
        <span class={`text-[10px] font-medium px-1.5 py-0.5 rounded ${impactPalette[props.card.impact]}`}>
          Impact {props.card.impact}
        </span>
        <span class={`text-[10px] font-medium px-1.5 py-0.5 rounded ${riskPalette[props.card.risk]}`}>
          Risk {props.card.risk}
        </span>
      </div>

      <span
        class={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full border ${status.class}`}
      >
        <span class={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
        {status.label}
      </span>
    </div>
  );
}
