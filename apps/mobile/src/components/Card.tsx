import { createSignal, Show } from "solid-js";
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

const kindGradients: Record<string, string> = {
  idea: "from-indigo-500 to-purple-600",
  work: "from-emerald-500 to-cyan-600",
  merge: "from-orange-500 to-rose-600",
  release: "from-purple-500 to-pink-600",
};

export default function Card(props: CardProps) {
  const [startY, setStartY] = createSignal<number | null>(null);
  const [deltaY, setDeltaY] = createSignal(0);
  const [dragging, setDragging] = createSignal(false);

  const icon = () => kindIcons[props.card.kind];
  const label = () => kindLabels[props.card.kind];
  const gradient = () => kindGradients[props.card.kind] ?? kindGradients.idea;

  const onTouchStart = (e: TouchEvent | MouseEvent) => {
    const clientY = "touches" in e ? e.touches[0]!.clientY : e.clientY;
    setStartY(clientY);
    setDragging(true);
  };

  const onTouchMove = (e: TouchEvent | MouseEvent) => {
    if (startY() === null) return;
    const clientY = "touches" in e ? e.touches[0]!.clientY : e.clientY;
    setDeltaY(clientY - startY()!);
  };

  const onTouchEnd = () => {
    setDragging(false);
    if (deltaY() < -100) {
      props.onSwipe("approve");
    } else if (deltaY() > 100) {
      props.onSwipe("reject");
    }
    setStartY(null);
    setDeltaY(0);
  };

  const transform = () => {
    if (!props.active) return "translateY(0)";
    const y = deltaY();
    const rotate = y / 20;
    const opacity = Math.max(0.5, 1 - Math.abs(y) / 400);
    return `translateY(${y}px) rotate(${rotate}deg)`;
  };

  return (
    <div
      class={`absolute inset-0 w-full h-full transition-transform duration-300 ${
        props.active ? "z-10" : props.hidden ? "-z-10 opacity-0" : "z-0 opacity-0"
      }`}
      style={{ transform: transform(), opacity: props.active ? Math.max(0.5, 1 - Math.abs(deltaY()) / 400) : 1 }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onTouchStart}
      onMouseMove={onTouchMove}
      onMouseUp={onTouchEnd}
      onMouseLeave={onTouchEnd}
      onClick={() => props.onToggleExpand()}
    >
      <div class="h-full w-full relative overflow-hidden rounded-3xl shadow-2xl">
        <div class={`absolute inset-0 bg-gradient-to-br ${gradient()} opacity-90`} />
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 to-transparent" />

        <div class="absolute inset-0 flex items-center justify-center opacity-20">
          {(() => {
            const Icon = icon();
            return <Icon size={180} class="text-white drop-shadow-lg" />;
          })()}
        </div>

        <div class="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20">
          <span class="px-4 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur text-white uppercase tracking-wider border border-white/10">
            {label()}
          </span>
          <span class={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur ${scoreColor(props.card.score)}`}>
            score {props.card.score.toFixed(1)}
          </span>
        </div>

        <div class="absolute inset-x-0 bottom-0 p-6 z-20 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
          <h2 class="text-3xl font-bold mb-2 leading-tight text-white drop-shadow-sm">{props.card.title}</h2>
          <p class={`text-white/90 text-base mb-4 leading-relaxed ${props.expanded ? "" : "line-clamp-3"}`}>
            {props.card.description}
          </p>

          <div class="flex items-center gap-3 text-xs text-white/80 mb-4 flex-wrap">
            <span class="bg-white/10 px-2 py-1 rounded">{props.card.repoFullName}</span>
            {props.card.issueNumber && <span class="bg-white/10 px-2 py-1 rounded">#{props.card.issueNumber}</span>}
            {props.card.pullNumber && <span class="bg-white/10 px-2 py-1 rounded">PR #{props.card.pullNumber}</span>}
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
              class="h-16 w-16 rounded-full bg-red-500/90 backdrop-blur flex items-center justify-center text-white shadow-xl active:scale-95 transition border-2 border-white/20"
            >
              <ThumbsDown size={32} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                props.onToggleExpand();
              }}
              class="text-white/90 hover:text-white transition p-2"
            >
              {props.expanded ? <ChevronDown size={28} /> : <ChevronUp size={28} />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                props.onSwipe("approve");
              }}
              class="h-16 w-16 rounded-full bg-emerald-500/90 backdrop-blur flex items-center justify-center text-white shadow-xl active:scale-95 transition border-2 border-white/20"
            >
              <ThumbsUp size={32} />
            </button>
          </div>
        </div>

        <Show when={deltaY() < -80 && dragging()}>
          <div class="absolute top-20 right-8 z-30 rounded-full bg-emerald-500/90 text-white px-4 py-2 font-bold shadow-xl border-2 border-white/20 animate-pulse">
            APPROVE
          </div>
        </Show>

        <Show when={deltaY() > 80 && dragging()}>
          <div class="absolute top-20 left-8 z-30 rounded-full bg-red-500/90 text-white px-4 py-2 font-bold shadow-xl border-2 border-white/20 animate-pulse">
            REJECT
          </div>
        </Show>
      </div>
    </div>
  );
}

function scoreColor(score: number): string {
  if (score >= 8) return "bg-emerald-500/80 text-white";
  if (score >= 5) return "bg-amber-500/80 text-white";
  return "bg-red-500/80 text-white";
}

function Metric(props: { label: string; value: string }) {
  return (
    <div class="bg-black/20 backdrop-blur rounded-xl p-2 border border-white/10">
      <div class="uppercase tracking-wider opacity-80 mb-1 text-white/70 text-[10px]">{props.label}</div>
      <div class="font-bold capitalize text-white">{props.value}</div>
    </div>
  );
}
