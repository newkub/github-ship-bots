import { createSignal, createEffect, onCleanup } from "solid-js";
import { Undo2, ThumbsUp, ThumbsDown } from "lucide-solid";

interface UndoToastProps {
  direction: "approve" | "reject";
  onUndo: () => void;
}

export default function UndoToast(props: UndoToastProps) {
  const [visible, setVisible] = createSignal(true);
  const [progress, setProgress] = createSignal(100);

  let timer: number | undefined;
  let frame: number | undefined;

  const start = () => {
    setVisible(true);
    setProgress(100);

    if (timer) window.clearTimeout(timer);
    if (frame) cancelAnimationFrame(frame);

    const duration = 5000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(p);
      if (p > 0) {
        frame = requestAnimationFrame(tick);
      } else {
        setVisible(false);
      }
    };

    frame = requestAnimationFrame(tick);
    timer = window.setTimeout(() => setVisible(false), duration);
  };

  createEffect(() => {
    // Track direction changes so a new swipe resets the timer.
    const _ = props.direction;
    start();
  });

  onCleanup(() => {
    if (timer) window.clearTimeout(timer);
    if (frame) cancelAnimationFrame(frame);
  });

  const handleUndo = () => {
    if (timer) window.clearTimeout(timer);
    if (frame) cancelAnimationFrame(frame);
    props.onUndo();
    setVisible(false);
  };

  if (!visible()) return null;

  const isApprove = props.direction === "approve";
  const action = isApprove ? "Approved" : "Rejected";
  const Icon = isApprove ? ThumbsUp : ThumbsDown;

  return (
    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm animate-slide-in-top">
      <div class={`rounded-2xl bg-surface border border-divider shadow-2xl overflow-hidden border-l-4 ${isApprove ? "border-l-success" : "border-l-danger"}`}>
        <div class="flex items-center justify-between px-4 py-3 gap-3">
          <div class="flex items-center gap-3">
            <div class={`h-10 w-10 rounded-full flex items-center justify-center ${isApprove ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
              <Icon size={20} />
            </div>
            <div>
              <p class="text-sm font-semibold text-primary">{action}</p>
              <p class="text-xs text-muted">Tap undo to cancel</p>
            </div>
          </div>
          <button
            onClick={handleUndo}
            class="flex items-center gap-1.5 rounded-full bg-accent/15 text-accent px-3 py-1.5 text-xs font-semibold hover:bg-accent/25 active:scale-95 transition shrink-0"
          >
            <Undo2 size={14} />
            Undo
          </button>
        </div>
        <div class="h-1 bg-elevated">
          <div
            class={`h-full transition-all duration-100 ${isApprove ? "bg-success" : "bg-danger"}`}
            style={{ width: `${progress()}%` }}
          />
        </div>
      </div>
    </div>
  );
}
