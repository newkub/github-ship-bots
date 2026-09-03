import { createSignal, onMount } from "solid-js";
import { Keyboard, Mic, Pen, Send, X } from "lucide-solid";
import ModeButton from "./PromptInput/ModeButton";
import TextPrompt from "./PromptInput/TextPrompt";
import VoiceRecorder from "./PromptInput/VoiceRecorder";
import SketchCanvas from "./PromptInput/SketchCanvas";

type PromptMode = "text" | "voice" | "sketch";

interface PromptInputProps {
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

export default function PromptInput(props: PromptInputProps) {
  const [mode, setMode] = createSignal<PromptMode>("text");
  const [text, setText] = createSignal("");
  const [recording, setRecording] = createSignal(false);
  const [canvasEmpty, setCanvasEmpty] = createSignal(true);

  let textarea: HTMLTextAreaElement | undefined;
  let canvas: HTMLCanvasElement | undefined;
  let ctx: CanvasRenderingContext2D | null = null;
  let drawing = false;
  let lastX = 0;
  let lastY = 0;
  let hasDrawn = false;

  onMount(() => {
    if (textarea) {
      textarea.focus();
      adjustHeight();
    }
  });

  const canSubmit = () => {
    if (text().trim()) return true;
    return mode() === "sketch" && !canvasEmpty();
  };

  const adjustHeight = () => {
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const submit = () => {
    if (!canSubmit()) return;

    let value = text().trim();
    if (mode() === "sketch" && !value && !canvasEmpty()) {
      value = "[Sketch attached]";
    }
    if (!value) return;

    props.onSubmit(value);
    setText("");
    if (textarea) textarea.style.height = "96px";
    clearCanvas();
  };

  const setModeAndFocus = (next: PromptMode) => {
    setMode(next);
    if (next === "text") {
      setTimeout(() => {
        if (textarea) {
          textarea.focus();
          adjustHeight();
        }
      }, 50);
    }
  };

  const toggleRecord = () => {
    if (recording()) {
      setRecording(false);
      if (!text().trim()) setText("Voice prompt recorded");
    } else {
      setRecording(true);
      setText("");
    }
  };

  const initCanvas = (el: HTMLCanvasElement) => {
    canvas = el;
    const dpr = window.devicePixelRatio || 1;
    const rect = el.getBoundingClientRect();
    el.width = Math.max(1, Math.floor(rect.width * dpr));
    el.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx = el.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = "var(--c-text)";
    }
    setCanvasEmpty(true);
    hasDrawn = false;
  };

  const getPoint = (e: PointerEvent) => {
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const clearCanvas = () => {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);
    hasDrawn = false;
    setCanvasEmpty(true);
  };

  const onPointerDown = (e: PointerEvent) => {
    if (!canvas) return;
    canvas.setPointerCapture?.(e.pointerId);
    const p = getPoint(e);
    drawing = true;
    lastX = p.x;
    lastY = p.y;
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!drawing || !ctx || !canvas) return;
    const p = getPoint(e);
    if (Math.abs(p.x - lastX) < 1 && Math.abs(p.y - lastY) < 1) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastX = p.x;
    lastY = p.y;
    if (!hasDrawn) {
      hasDrawn = true;
      setCanvasEmpty(false);
    }
  };

  const onPointerUp = (e: PointerEvent) => {
    drawing = false;
    canvas?.releasePointerCapture?.(e.pointerId);
  };

  return (
    <div class="fixed inset-x-0 bottom-0 z-50 bg-surface/98 backdrop-blur-xl border-t border-divider p-4 pb-8 safe-area-pb animate-slide-up">
      <div class="w-12 h-1 rounded-full bg-elevated mx-auto mb-4" />

      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-semibold text-primary">Add prompt</span>
        <button
          onClick={props.onCancel}
          class="h-8 w-8 rounded-full bg-elevated flex items-center justify-center text-muted hover:text-primary transition"
          aria-label="Cancel"
        >
          <X size={18} />
        </button>
      </div>

      <div class="flex gap-1 mb-3 p-1 bg-elevated rounded-xl">
        <ModeButton
          active={mode() === "text"}
          onClick={() => setModeAndFocus("text")}
          icon={Keyboard}
          label="Text"
        />
        <ModeButton
          active={mode() === "voice"}
          onClick={() => setModeAndFocus("voice")}
          icon={Mic}
          label="Voice"
        />
        <ModeButton
          active={mode() === "sketch"}
          onClick={() => setModeAndFocus("sketch")}
          icon={Pen}
          label="Sketch"
        />
      </div>

      {mode() === "text" && (
        <TextPrompt
          text={text}
          setText={setText}
          textareaRef={(el) => (textarea = el)}
          adjustHeight={adjustHeight}
        />
      )}

      {mode() === "voice" && (
        <VoiceRecorder recording={recording} toggleRecord={toggleRecord} />
      )}

      {mode() === "sketch" && (
        <SketchCanvas
          canvasEmpty={canvasEmpty}
          initCanvas={initCanvas}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          clearCanvas={clearCanvas}
        />
      )}

      <div class="flex justify-end mt-3">
        <button
          onClick={submit}
          disabled={!canSubmit()}
          class="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40 disabled:scale-100 shadow-lg active:scale-95 transition"
        >
          <Send size={16} />
          Attach prompt
        </button>
      </div>
    </div>
  );
}
