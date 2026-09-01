import { createSignal, type JSX, Match, Switch } from "solid-js";
import { ThumbsUp, ThumbsDown, ChevronUp, ChevronDown, Rocket, Briefcase, GitMerge, Package } from "lucide-solid";
import type { ShipCard } from "@ship-feed/shared";

interface CardProps {
  card: ShipCard;
  active: boolean;
  hidden: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onSwipe: (direction: "approve" | "reject") => void;
}

const kindIcons = {
  idea: Rocket,
  work: Briefcase,
  merge: GitMerge,
  release: Package,
};

const kindLabels = {
  idea: "Idea",
  work: "Work",
  merge: "Merge",
  release: "Release",
};

export default function Card(props: CardProps) {
  const [startY, setStartY] = createSignal<number | null>(null);
  const [deltaY, setDeltaY] = createSignal(0);

  const icon = () => kindIcons[props.card.kind];
  const label = () => kindLabels[props.card.kind];

  const onTouchStart = (e: TouchEvent | MouseEvent) => {
    const clientY = "touches" in e ? e.touches[0]!.clientY : e.clientY;
    setStartY(clientY);
  };

  const onTouchMove = (e: TouchEvent | MouseEvent) => {
    if (startY() === null) return;
    const clientY = "touches" in e ? e.touches[0]!.clientY : e.clientY;
    setDeltaY(clientY - startY()!);
  };

  const onTouchEnd = () => {
    if (deltaY() < -100) {
      props.onSwipe("approve");
    } else if (deltaY() > 100) {
      props.onSwipe("reject");
    }
    setStartY(null);
    setDeltaY(0);
  };

  return (
    <div
      class={`absolute inset-0 w-full h-full transition-transform duration-300 ${
        props.active ? "z-10" : props.hidden ? "-z-10 opacity-0" : "z-0 opacity-0"
      }`}
      style={{ transform: `translateY(${props.active ? deltaY() : 0}px)` }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onTouchStart}
      onMouseMove={onTouchMove}
      onMouseUp={onTouchEnd}
      onMouseLeave={onTouchEnd}
      onClick={() => props.onToggleExpand()}
    >
      <div class="h-full w-full relative bg-gray-900 overflow-hidden">
        <div class="absolute inset-0 flex items-center justify-center opacity-20">
          {(() => {
            const Icon = icon();
            return <Icon size={160} />;
          })()}
        </div>

        <div class="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20">
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-600/80 uppercase tracking-wide">
            {label()}
          </span>
          <span class={`px-3 py-1 rounded-full text-xs font-semibold ${scoreColor(props.card.score)}`}>
            score {props.card.score.toFixed(1)}
          </span>
        </div>

        <div class="absolute inset-x-0 bottom-0 p-6 card-gradient z-20">
          <h2 class="text-2xl font-bold mb-2 leading-tight">{props.card.title}</h2>
          <p class={`text-gray-200 text-sm mb-4 ${props.expanded ? "" : "line-clamp-3"}`}>
            {props.card.description}
          </p>

          <div class="flex items-center gap-4 text-xs text-gray-300 mb-4">
            <span>{props.card.repoFullName}</span>
            {props.card.issueNumber && <span>#{props.card.issueNumber}</span>}
            {props.card.pullNumber && <span>PR #{props.card.pullNumber}</span>}
          </div>

          <div class="grid grid-cols-3 gap-2 text-center text-xs mb-6">
            <Metric label="impact" value={props.card.impact} />
            <Metric label="risk" value={props.card.risk} />
            <Metric label="effect" value={props.card.effect} />
          </div>

          <div class="flex justify-between items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                props.onSwipe("reject");
              }}
              class="h-14 w-14 rounded-full bg-red-500/90 flex items-center justify-center text-white shadow-lg active:scale-95"
            >
              <ThumbsDown size={28} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                props.onToggleExpand();
              }}
              class="text-white/80"
            >
              {props.expanded ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                props.onSwipe("approve");
              }}
              class="h-14 w-14 rounded-full bg-emerald-500/90 flex items-center justify-center text-white shadow-lg active:scale-95"
            >
              <ThumbsUp size={28} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function scoreColor(score: number): string {
  if (score >= 8) return "bg-emerald-600/80";
  if (score >= 5) return "bg-yellow-600/80";
  return "bg-red-600/80";
}

function Metric(props: { label: string; value: string }) {
  return (
    <div class="bg-black/30 rounded p-2">
      <div class="uppercase tracking-wider opacity-70 mb-1">{props.label}</div>
      <div class="font-semibold capitalize">{props.value}</div>
    </div>
  );
}
