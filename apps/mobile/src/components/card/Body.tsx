import { Show } from "solid-js";
import { FileImage } from "lucide-solid";
import type { ShipCard } from "@ship-feed/shared";
import Metric from "./Metric";

interface BodyProps {
  card: ShipCard;
  expanded: boolean;
  prompt?: string;
}

export default function Body(props: BodyProps) {
  return (
    <div>
      <h2 class="text-2xl sm:text-3xl font-bold mb-2 leading-tight text-white drop-shadow-sm">
        {props.card.title}
      </h2>
      <p class={`text-white/90 text-base mb-4 leading-relaxed ${props.expanded ? "line-clamp-6" : "line-clamp-3"}`}>
        {props.card.description}
      </p>

      <div class="flex items-center gap-2 text-xs text-white/80 mb-4 flex-wrap">
        <span class="bg-white/10 px-2 py-1 rounded">{props.card.repoFullName}</span>
        {props.card.issueNumber && <span class="bg-white/10 px-2 py-1 rounded">#{props.card.issueNumber}</span>}
        {props.card.pullNumber && <span class="bg-white/10 px-2 py-1 rounded">PR #{props.card.pullNumber}</span>}
      </div>

      <div class="grid grid-cols-3 gap-2 text-center text-xs mb-4">
        <Metric label="impact" value={props.card.impact} />
        <Metric label="risk" value={props.card.risk} />
        <Metric label="effect" value={props.card.effect} />
      </div>

      <Show when={props.card.evidenceIds.length > 0}>
        <div class="flex items-center gap-2 mb-4">
          <span class="flex items-center gap-1.5 text-xs text-white/80 bg-white/10 px-2 py-1 rounded">
            <FileImage size={12} />
            {props.card.evidenceIds.length} evidence
          </span>
          <span class="text-xs text-white/60">tap to expand for preview</span>
        </div>
      </Show>

      <Show when={props.prompt}>
        <div class="mb-4 rounded-xl bg-white/10 border border-white/20 p-3">
          <div class="text-[10px] uppercase tracking-wider text-white/60 mb-1">Attached prompt</div>
          <p class="text-sm text-white">{props.prompt}</p>
        </div>
      </Show>
    </div>
  );
}
