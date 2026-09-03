import { createSignal } from "solid-js";

const SWIPE_THRESHOLD = 100;
const HAPTIC_DEADZONE = 14;

function getClient(e: TouchEvent | MouseEvent) {
  if ("touches" in e && e.touches.length > 0) {
    return { x: e.touches[0]!.clientX, y: e.touches[0]!.clientY };
  }
  if ("changedTouches" in e && (e as TouchEvent).changedTouches.length > 0) {
    const t = (e as TouchEvent).changedTouches[0]!;
    return { x: t.clientX, y: t.clientY };
  }
  return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
}

function haptic(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return !!target.closest("button, a, [data-no-swipe], input, textarea");
}

interface UseSwipeOptions {
  active: boolean;
  onToggleExpand: () => void;
  onSwipe: (direction: "approve" | "reject") => void;
}

export function useSwipe(options: UseSwipeOptions) {
  const [startX, setStartX] = createSignal<number | null>(null);
  const [startY, setStartY] = createSignal<number | null>(null);
  const [deltaX, setDeltaX] = createSignal(0);
  const [deltaY, setDeltaY] = createSignal(0);
  const [dragging, setDragging] = createSignal(false);
  const [hasDragged, setHasDragged] = createSignal(false);
  const [hapticReady, setHapticReady] = createSignal(true);
  const [exiting, setExiting] = createSignal<"approve" | "reject" | null>(null);

  const onTouchStart = (e: TouchEvent | MouseEvent) => {
    if (exiting() || !options.active) return;
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

  const triggerSwipe = (direction: "approve" | "reject") => {
    haptic(direction === "approve" ? [10, 18] : [12, 28, 12]);
    setExiting(direction);
    window.setTimeout(() => {
      setExiting(null);
      options.onSwipe(direction);
    }, 220);
  };

  const onTouchEnd = (e: TouchEvent | MouseEvent) => {
    if (exiting() || startX() === null || startY() === null) return;

    setDragging(false);
    const dx = deltaX();
    const dy = deltaY();

    const target = e.target;
    if (!isInteractiveTarget(target) && Math.abs(dx) < 24 && Math.abs(dy) < 24 && !hasDragged()) {
      options.onToggleExpand();
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

  const likeOpacity = () => Math.max(0, Math.min(1, deltaX() / SWIPE_THRESHOLD));
  const nopeOpacity = () => Math.max(0, Math.min(1, -deltaX() / SWIPE_THRESHOLD));

  return {
    startX,
    startY,
    deltaX,
    deltaY,
    dragging,
    hasDragged,
    hapticReady,
    exiting,
    setExiting,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    triggerSwipe,
    likeOpacity,
    nopeOpacity,
    SWIPE_THRESHOLD,
  };
}
