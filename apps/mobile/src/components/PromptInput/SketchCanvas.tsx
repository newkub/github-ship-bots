import { Pen, Eraser } from "lucide-solid";

interface SketchCanvasProps {
  canvasEmpty: () => boolean;
  initCanvas: (el: HTMLCanvasElement) => void;
  onPointerDown: (e: PointerEvent) => void;
  onPointerMove: (e: PointerEvent) => void;
  onPointerUp: (e: PointerEvent) => void;
  clearCanvas: () => void;
}

export default function SketchCanvas(props: SketchCanvasProps) {
  return (
    <div class="relative rounded-xl bg-elevated border border-dashed border-divider overflow-hidden">
      <canvas
        ref={props.initCanvas}
        onPointerDown={props.onPointerDown}
        onPointerMove={props.onPointerMove}
        onPointerUp={props.onPointerUp}
        onPointerLeave={props.onPointerUp}
        class="w-full h-32 touch-none block"
        style={{ "touch-action": "none" }}
      />
      {props.canvasEmpty() && (
        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-muted">
          <Pen size={24} class="mb-2 opacity-50" />
          <span class="text-xs">Tap and draw to explain</span>
        </div>
      )}
      <button
        onClick={props.clearCanvas}
        disabled={props.canvasEmpty()}
        class="absolute top-2 right-2 h-8 w-8 rounded-full bg-surface/80 backdrop-blur flex items-center justify-center text-muted hover:text-primary disabled:opacity-30 transition"
        aria-label="Clear sketch"
      >
        <Eraser size={16} />
      </button>
    </div>
  );
}
