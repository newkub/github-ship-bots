import { createSignal, onCleanup } from "solid-js";
import { Undo2 } from "lucide-solid";

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

  start();

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

  const action = props.direction === "approve" ? "Approved" : "Rejected";

  return (
    <div class="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm">
      <div class="rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl overflow-hidden">
        <div class="flex items-center justify-between px-4 py-3">
          <div>
            <p class="text-sm font-semibold text-white">{action}</p>
            <p class="text-xs text-zinc-400">Tap undo to cancel</p>
          </div>
          <button
            onClick={handleUndo}
            class="flex items-center gap-1.5 rounded-full bg-indigo-500/20 text-indigo-400 px-3 py-1.5 text-xs font-semibold hover:bg-indigo-500/30"
          >
            <Undo2 size={14} />
            Undo
          </button>
        </div>
        <div class="h-1 bg-zinc-800">
          <div
            class="h-full bg-indigo-500 transition-all duration-100"
            style={{ width: `${progress()}%` }}
          />
        </div>
      </div>
    </div>
  );
}
