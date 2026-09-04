import { createResource, createSignal, For, Show } from "solid-js";
import { ThumbsUp, ThumbsDown, SkipForward, Inbox, Bell, Loader } from "lucide-solid";
import BottomNav from "../components/BottomNav";
import EmptyState from "../components/EmptyState";
import type { Component } from "solid-js";
import type { ShipCard } from "@ship-feed/shared";
import { fetchNudges, swipeCard, fetchConfig } from "../api";

type NudgeAction = "approve" | "reject" | "skip";

interface Nudge {
  id: string;
  title: string;
  repo: string;
  action: NudgeAction;
}

function cardToNudge(card: ShipCard, threshold: number, allowedRisk: string): Nudge {
  return {
    id: card.id,
    title: card.title,
    repo: card.repoFullName,
    action: card.score >= threshold && card.risk === allowedRisk ? "approve" : "reject",
  };
}

export default function Alerts() {
  const [nudges, { refetch }] = createResource(async () => {
    const [cards, cfg] = await Promise.all([fetchNudges(), fetchConfig()]);
    return cards.map((card) => cardToNudge(card, cfg.autoApproveThreshold, cfg.autoApproveRisk));
  });

  const handleAction = async (id: string, action: NudgeAction) => {
    if (action === "approve" || action === "reject") {
      await swipeCard({ cardId: id, direction: action }).catch(() => {});
    }
    refetch();
  };

  return (
    <div class="h-screen w-screen flex flex-col bg-app text-primary">
      <header class="pt-safe px-6 py-4 bg-surface border-b border-divider flex items-center justify-between">
        <div>
          <h1 class="text-xl font-bold flex items-center gap-2">
            <Bell size={20} class="text-accent" />
            Notifications
          </h1>
          <p class="text-sm text-muted">Quick actions for pending cards</p>
        </div>
        <span class="px-2.5 py-1 rounded-full bg-elevated text-xs font-semibold text-muted border border-divider">
          {nudges()?.length ?? 0} pending
        </span>
      </header>

      <div class="flex-1 overflow-auto p-4 no-scrollbar">
        <Show when={nudges.loading}>
          <div class="h-full flex items-center justify-center text-muted">
            <Loader size={24} class="animate-spin mr-2" />
            Loading nudges...
          </div>
        </Show>

        <Show when={nudges.error}>
          <EmptyState
            class="h-full"
            icon={Inbox}
            title="Could not load nudges"
            subtitle="Check your connection and try again."
          />
        </Show>

        <For each={nudges() ?? []}>
          {(nudge) => <NudgeCard nudge={nudge} onAction={(action) => handleAction(nudge.id, action)} />}
        </For>

        <Show when={!nudges.loading && !nudges.error && (nudges() ?? []).length === 0}>
          <EmptyState
            class="h-full"
            icon={Inbox}
            title="No pending nudges"
            subtitle="You're all caught up. New notifications will appear here when cards need your attention."
          />
        </Show>
      </div>

      <BottomNav active="alerts" nudgeCount={nudges()?.length ?? 0} />
    </div>
  );
}

interface NudgeCardProps {
  nudge: Nudge;
  onAction: (action: NudgeAction) => void;
}

const SWIPE_THRESHOLD = 80;

function NudgeCard(props: NudgeCardProps) {
  const [startX, setStartX] = createSignal<number | null>(null);
  const [startY, setStartY] = createSignal<number | null>(null);
  const [deltaX, setDeltaX] = createSignal(0);
  const [dragging, setDragging] = createSignal(false);
  const [exiting, setExiting] = createSignal<NudgeAction | null>(null);

  const opacity = () => Math.min(1, Math.abs(deltaX()) / SWIPE_THRESHOLD);

  const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof HTMLElement)) return false;
    return !!target.closest("button, a, [data-no-swipe]");
  };

  const onTouchStart = (e: TouchEvent | MouseEvent) => {
    if (exiting() || isInteractiveTarget(e.target)) return;
    const p = getClient(e);
    setStartX(p.x);
    setStartY(p.y);
    setDragging(true);
  };

  const onTouchMove = (e: TouchEvent | MouseEvent) => {
    if (exiting() || startX() === null || startY() === null) return;
    const p = getClient(e);
    const dx = p.x - startX()!;
    const dy = p.y - startY()!;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 12) {
      e.preventDefault();
      setDeltaX(dx);
    }
  };

  const onTouchEnd = () => {
    if (exiting() || startX() === null) return;
    setDragging(false);
    const dx = deltaX();

    if (dx > SWIPE_THRESHOLD) {
      dismiss("approve");
    } else if (dx < -SWIPE_THRESHOLD) {
      dismiss("reject");
    } else {
      setDeltaX(0);
    }

    setStartX(null);
    setStartY(null);
  };

  const dismiss = (action: NudgeAction) => {
    setExiting(action);
    window.setTimeout(() => {
      setExiting(null);
      props.onAction(action);
    }, 220);
  };

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

  const transform = () => {
    if (exiting() === "approve") return "translate3d(120%, 0, 0) rotateZ(4deg)";
    if (exiting() === "reject") return "translate3d(-120%, 0, 0) rotateZ(-4deg)";
    return `translate3d(${deltaX()}px, 0, 0)`;
  };

  const transitionClass = () => (dragging() || exiting() ? "transition-transform duration-200 ease-out" : "transition-transform duration-200 ease-out");

  return (
    <div class="relative mb-4 rounded-2xl overflow-hidden" style={{ "touch-action": "pan-y" }}>
      <div class="absolute inset-0 flex">
        <div
          class="flex-1 bg-success/90 flex items-center pl-5 text-white font-bold tracking-wider"
          style={{ opacity: deltaX() > 0 ? opacity() : 0 }}
        >
          <ThumbsUp size={20} class="mr-2" />
          APPROVE
        </div>
        <div
          class="flex-1 bg-danger/90 flex items-center justify-end pr-5 text-white font-bold tracking-wider"
          style={{ opacity: deltaX() < 0 ? opacity() : 0 }}
        >
          REJECT
          <ThumbsDown size={20} class="ml-2" />
        </div>
      </div>

      <div
        class={`relative z-10 bg-elevated border border-divider rounded-2xl p-4 ${transitionClass()}`}
        style={{ transform: transform() }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={onTouchMove}
        onMouseUp={onTouchEnd}
        onMouseLeave={onTouchEnd}
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="text-xs text-muted mb-1 truncate">{props.nudge.repo}</div>
            <h2 class="font-semibold text-primary leading-snug">{props.nudge.title}</h2>
            {props.nudge.action !== "skip" && (
              <span
                class={`inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  props.nudge.action === "approve" ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
                }`}
              >
                {props.nudge.action === "approve" ? <ThumbsUp size={10} /> : <ThumbsDown size={10} />}
                Suggested {props.nudge.action}
              </span>
            )}
          </div>
          <button
            onClick={() => props.onAction("skip")}
            class="h-8 w-8 rounded-full bg-surface flex items-center justify-center text-muted hover:text-primary active:scale-95 transition"
            aria-label="Skip"
          >
            <SkipForward size={16} />
          </button>
        </div>

        <div class="flex gap-2 mt-4">
          <button
            onClick={() => props.onAction("approve")}
            class="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-success/15 text-success py-2.5 text-sm font-semibold active:scale-95 transition"
          >
            <ThumbsUp size={16} />
            Approve
          </button>
          <button
            onClick={() => props.onAction("reject")}
            class="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-danger/15 text-danger py-2.5 text-sm font-semibold active:scale-95 transition"
          >
            <ThumbsDown size={16} />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
