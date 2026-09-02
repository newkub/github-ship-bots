import { createSignal, Show } from "solid-js";
import {
  ThumbsUp,
  ThumbsDown,
  ChevronUp,
  ChevronDown,
  Rocket,
  Briefcase,
  GitMerge,
  Package,
  MessageSquarePlus,
  FileImage,
} from "lucide-solid";
import type { ShipCard } from "@ship-feed/shared";
import type { Component } from "solid-js";

export const kindIcons = {
  idea: Rocket,
  work: Briefcase,
  merge: GitMerge,
  release: Package,
};

export const kindLabels = {
  idea: "Idea",
  work: "Work",
  merge: "Merge",
  release: "Release",
};

export const kindGradients: Record<string, string> = {
  idea: "from-indigo-500 to-purple-600",
  work: "from-emerald-500 to-cyan-600",
  merge: "from-orange-500 to-rose-600",
  release: "from-purple-500 to-pink-600",
};

export function scoreColor(score: number): string {
  if (score >= 8) return "bg-success/80 text-white";
  if (score >= 5) return "bg-warning/80 text-white";
  return "bg-danger/80 text-white";
}

interface CardProps {
  card: ShipCard;
  active: boolean;
  hidden: boolean;
  stackIndex?: number;
  expanded: boolean;
  prompt?: string;
  onToggleExpand: () => void;
  onSwipe: (direction: "approve" | "reject") => void;
  onAddPrompt: () => void;
}

const SWIPE_THRESHOLD = 100;
const HAPTIC_DEADZONE = 14;

export default function Card(props: CardProps) {
  const [startX, setStartX] = createSignal<number | null>(null);
  const [startY, setStartY] = createSignal<number | null>(null);
  const [deltaX, setDeltaX] = createSignal(0);
  const [deltaY, setDeltaY] = createSignal(0);
  const [dragging, setDragging] = createSignal(false);
  const [hasDragged, setHasDragged] = createSignal(false);
  const [hapticReady, setHapticReady] = createSignal(true);
  const [exiting, setExiting] = createSignal<"approve" | "reject" | null>(null);

  const icon = () => kindIcons[props.card.kind];
  const label = () => kindLabels[props.card.kind];
  const gradient = () => kindGradients[props.card.kind] ?? kindGradients.idea;
  const stack = () => props.stackIndex ?? 0;

  const getClient = (e: TouchEvent | MouseEvent) => {
    if ("touches" in e && e.touches.length > 0) {
      return { x: e.touches[0]!.clientX, y: e.touches[0]!.clientY };
    }
    if ("changedTouches" in e && (e as TouchEvent).changedTouches.length > 0) {
      const t = (e as TouchEvent).changedTouches[0]!;
      return { x: t.clientX, y: t.clientY };
    }
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
  };

  const haptic = (pattern: number | number[]) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return !!target.closest("button, a, [data-no-swipe], input, textarea");
  };

  const onTouchStart = (e: TouchEvent | MouseEvent) => {
    if (exiting() || !props.active) return;
    if (isInteractiveTarget(e.target)) return;

    const p = getClient(e);
    setStartX(p.x);
    setStartY(p.y);
    setDragging(true);
    setHasDragged(false);
    setHapticReady(true);
  };

  const onTouchMove = (e: TouchEvent | MouseEvent) => {
    if (exiting() || startX() === null || startY() === null) return;

    const p = getClient(e);
    const dx = p.x - startX()!;
    const dy = p.y - startY()!;

    if (Math.abs(dx) > HAPTIC_DEADZONE || Math.abs(dy) > HAPTIC_DEADZONE) {
      setHasDragged(true);
    }

    setDeltaX(dx);
    setDeltaY(dy);

    if (Math.abs(dx) > SWIPE_THRESHOLD * 0.8 && hapticReady()) {
      haptic(5);
      setHapticReady(false);
    }
  };

  const onTouchEnd = (e: TouchEvent | MouseEvent) => {
    if (exiting() || startX() === null || startY() === null) return;

    setDragging(false);
    const dx = deltaX();
    const dy = deltaY();

    const target = e.target;
    if (!isInteractiveTarget(target) && Math.abs(dx) < 24 && Math.abs(dy) < 24 && !hasDragged()) {
      props.onToggleExpand();
    } else if (dx > SWIPE_THRESHOLD) {
      triggerSwipe("approve");
    } else if (dx < -SWIPE_THRESHOLD) {
      triggerSwipe("reject");
    }

    setStartX(null);
    setStartY(null);
    setDeltaX(0);
    setDeltaY(0);
    setHasDragged(false);
    setHapticReady(true);
  };

  const triggerSwipe = (direction: "approve" | "reject") => {
    haptic(direction === "approve" ? [10, 18] : [12, 28, 12]);
    setExiting(direction);
    window.setTimeout(() => {
      setExiting(null);
      props.onSwipe(direction);
    }, 220);
  };

  const likeOpacity = () => Math.max(0, Math.min(1, deltaX() / SWIPE_THRESHOLD));
  const nopeOpacity = () => Math.max(0, Math.min(1, -deltaX() / SWIPE_THRESHOLD));

  const transform = () => {
    if (exiting()) {
      const x = exiting() === "approve" ? "120%" : "-120%";
      const r = exiting() === "approve" ? 10 : -10;
      return `translate3d(${x}, 0, 0) rotateZ(${r}deg) scale(0.96)`;
    }

    if (props.hidden) return "translate3d(0, 0, 0) scale(0.9)";

    if (stack() === 1) return "translate3d(0, 14px, 0) scale(0.96)";
    if (stack() > 1) return "translate3d(0, 28px, 0) scale(0.92)";

    const x = deltaX();
    const y = deltaY();
    const r = x / 22;
    const s = 1 - Math.min(0.06, Math.abs(x) / 3000);
    return `translate3d(${x}px, ${y}px, 0) rotateZ(${r}deg) scale(${s})`;
  };

  const containerClass = () => {
    if (exiting()) {
      return "z-50 opacity-100 transition-transform duration-200 ease-out";
    }
    if (props.hidden || stack() > 1) {
      return "-z-10 opacity-0";
    }
    if (props.active) {
      return `z-10 opacity-100 ${dragging() ? "" : "transition-all duration-200 ease-out"}`;
    }
    return "z-0 opacity-40 transition-all duration-300 ease-out";
  };

  return (
    <div
      class={`absolute inset-0 w-full h-full select-none ${containerClass()}`}
      style={{ transform: transform(), "will-change": "transform", "touch-action": "none" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onTouchStart}
      onMouseMove={onTouchMove}
      onMouseUp={onTouchEnd}
      onMouseLeave={onTouchEnd}
    >
      <div class="h-full w-full relative overflow-hidden rounded-3xl shadow-2xl">
        <div class={`absolute inset-0 bg-gradient-to-br ${gradient()} opacity-95`} />
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 to-transparent" />

        <Show when={likeOpacity() > 0}>
          <div
            class="absolute top-16 right-8 z-30 flex flex-col items-center justify-center rounded-2xl bg-emerald-500/90 text-white px-5 py-3 font-black tracking-widest uppercase shadow-xl border-2 border-white/30 pointer-events-none"
            style={{ opacity: likeOpacity(), transform: `scale(${0.6 + likeOpacity() * 0.4}) rotate(8deg)` }}
          >
            <ThumbsUp size={28} />
            <span class="text-sm mt-1">Approve</span>
          </div>
        </Show>

        <Show when={nopeOpacity() > 0}>
          <div
            class="absolute top-16 left-8 z-30 flex flex-col items-center justify-center rounded-2xl bg-rose-500/90 text-white px-5 py-3 font-black tracking-widest uppercase shadow-xl border-2 border-white/30 pointer-events-none"
            style={{ opacity: nopeOpacity(), transform: `scale(${0.6 + nopeOpacity() * 0.4}) rotate(-8deg)` }}
          >
            <ThumbsDown size={28} />
            <span class="text-sm mt-1">Reject</span>
          </div>
        </Show>

        <div
          class="absolute inset-y-0 right-0 w-2/5 bg-gradient-to-l from-emerald-500/40 to-transparent pointer-events-none"
          style={{ opacity: likeOpacity() * 0.7 }}
        />
        <div
          class="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-rose-500/40 to-transparent pointer-events-none"
          style={{ opacity: nopeOpacity() * 0.7 }}
        />

        <div class="absolute inset-0 flex items-center justify-center opacity-10">
          {(() => {
            const Icon = icon();
            return <Icon size={160} class="text-white drop-shadow-lg" />;
          })()}
        </div>

        <div class="absolute top-0 left-0 right-0 p-5 flex justify-between items-start z-20">
          <span class="px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur text-white uppercase tracking-wider border border-white/10">
            {label()}
          </span>
          <span class={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur ${scoreColor(props.card.score)}`}>
            score {props.card.score.toFixed(1)}
          </span>
        </div>

        <div class="absolute inset-x-0 bottom-0 p-5 z-20 card-gradient max-h-[75%] overflow-y-auto no-scrollbar">
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

          <div class="flex justify-between items-center pt-1">
            <button
              data-no-swipe
              onClick={(e) => {
                e.stopPropagation();
                triggerSwipe("reject");
              }}
              class="h-14 w-14 rounded-full bg-rose-500/90 backdrop-blur flex items-center justify-center text-white shadow-xl active:scale-90 transition border-2 border-white/20"
              aria-label="Reject"
            >
              <ThumbsDown size={28} />
            </button>

            <div class="flex items-center gap-3">
              <button
                data-no-swipe
                onClick={(e) => {
                  e.stopPropagation();
                  props.onAddPrompt();
                }}
                class={`h-12 w-12 rounded-full backdrop-blur flex items-center justify-center shadow-xl active:scale-90 transition border-2 border-white/20 ${
                  props.prompt ? "bg-accent/80 text-white" : "bg-white/20 text-white"
                }`}
                aria-label="Add prompt"
              >
                <MessageSquarePlus size={22} />
              </button>

              <button
                data-no-swipe
                onClick={(e) => {
                  e.stopPropagation();
                  props.onToggleExpand();
                }}
                class="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white/90 active:scale-90 transition"
                aria-label="Expand"
              >
                {props.expanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
              </button>
            </div>

            <button
              data-no-swipe
              onClick={(e) => {
                e.stopPropagation();
                triggerSwipe("approve");
              }}
              class="h-14 w-14 rounded-full bg-emerald-500/90 backdrop-blur flex items-center justify-center text-white shadow-xl active:scale-90 transition border-2 border-white/20"
              aria-label="Approve"
            >
              <ThumbsUp size={28} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric(props: { label: string; value: string }) {
  return (
    <div class="bg-black/20 backdrop-blur rounded-xl p-2 border border-white/10">
      <div class="uppercase tracking-wider opacity-80 mb-1 text-white/70 text-[10px]">{props.label}</div>
      <div class="font-bold capitalize text-white">{props.value}</div>
    </div>
  );
}
