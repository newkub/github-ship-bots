import { createSignal, Show } from "solid-js";
import { ThumbsUp, ThumbsDown, ChevronUp, ChevronDown, Rocket, Briefcase, GitMerge, Package, MessageSquarePlus, FileImage } from "lucide-solid";
import type { ShipCard } from "@ship-feed/shared";

interface CardProps {
  card: ShipCard;
  active: boolean;
  hidden: boolean;
  expanded: boolean;
  prompt?: string;
  onToggleExpand: () => void;
  onSwipe: (direction: "approve" | "reject") => void;
  onAddPrompt: () => void;
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

const SWIPE_THRESHOLD = 100;

export default function Card(props: CardProps) {
  const [startX, setStartX] = createSignal<number | null>(null);
  const [startY, setStartY] = createSignal<number | null>(null);
  const [deltaX, setDeltaX] = createSignal(0);
  const [deltaY, setDeltaY] = createSignal(0);
  const [dragging, setDragging] = createSignal(false);
  const [hasDragged, setHasDragged] = createSignal(false);

  const icon = () => kindIcons[props.card.kind];
  const label = () => kindLabels[props.card.kind];
  const gradient = () => kindGradients[props.card.kind] ?? kindGradients.idea;

  const getClient = (e: TouchEvent | MouseEvent) => {
    if ("touches" in e && e.touches.length > 0) {
      return { x: e.touches[0]!.clientX, y: e.touches[0]!.clientY };
    }
    if ("changedTouches" in e && (e as TouchEvent).changedTouches.length > 0) {
      return { x: (e as TouchEvent).changedTouches[0]!.clientX, y: (e as TouchEvent).changedTouches[0]!.clientY };
    }
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
  };

  const onTouchStart = (e: TouchEvent | MouseEvent) => {
    const p = getClient(e);
    setStartX(p.x);
    setStartY(p.y);
    setDragging(true);
    setHasDragged(false);
    setDeltaX(0);
    setDeltaY(0);
  };

  const onTouchMove = (e: TouchEvent | MouseEvent) => {
    if (startX() === null || startY() === null) return;
    const p = getClient(e);
    const dx = p.x - startX()!;
    const dy = p.y - startY()!;
    setDeltaX(dx);
    setDeltaY(dy);
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) setHasDragged(true);
  };

  const onTouchEnd = () => {
    setDragging(false);
    const dx = deltaX();
    const dy = deltaY();
    if (dx > SWIPE_THRESHOLD) {
      haptic();
      props.onSwipe("approve");
    } else if (dx < -SWIPE_THRESHOLD) {
      haptic();
      props.onSwipe("reject");
    } else if (Math.abs(dy) < 30 && Math.abs(dx) < 30 && !hasDragged()) {
      props.onToggleExpand();
    }
    setStartX(null);
    setStartY(null);
    setDeltaX(0);
    setDeltaY(0);
    setHasDragged(false);
  };

  const haptic = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(12);
    }
  };

  const transform = () => {
    if (!props.active) return "translateX(0)";
    const x = deltaX();
    const y = deltaY();
    const rotate = x / 20;
    return `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
  };

  const likeOpacity = () => Math.max(0, Math.min(1, deltaX() / SWIPE_THRESHOLD));
  const nopeOpacity = () => Math.max(0, Math.min(1, -deltaX() / SWIPE_THRESHOLD));

  return (
    <div
      class={`absolute inset-0 w-full h-full select-none ${
        props.active ? "z-10" : props.hidden ? "-z-10 opacity-0" : "z-0 opacity-0"
      }`}
      style={{ transform: transform(), "will-change": "transform" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onTouchStart}
      onMouseMove={onTouchMove}
      onMouseUp={onTouchEnd}
      onMouseLeave={onTouchEnd}
    >
      <div class="h-full w-full relative overflow-hidden rounded-3xl shadow-2xl">
        <div class={`absolute inset-0 bg-gradient-to-br ${gradient()} opacity-90`} />
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 to-transparent" />

        <Show when={likeOpacity() > 0}>
          <div
            class="absolute top-20 right-8 z-30 rounded-full bg-emerald-500/90 text-white px-4 py-2 font-bold shadow-xl border-2 border-white/20 animate-pulse"
            style={{ opacity: likeOpacity() }}
          >
            APPROVE
          </div>
        </Show>

        <Show when={nopeOpacity() > 0}>
          <div
            class="absolute top-20 left-8 z-30 rounded-full bg-red-500/90 text-white px-4 py-2 font-bold shadow-xl border-2 border-white/20 animate-pulse"
            style={{ opacity: nopeOpacity() }}
          >
            REJECT
          </div>
        </Show>

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
                props.onAddPrompt();
              }}
              class="h-12 w-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white shadow-xl active:scale-95 transition border-2 border-white/20"
            >
              <MessageSquarePlus size={22} />
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
