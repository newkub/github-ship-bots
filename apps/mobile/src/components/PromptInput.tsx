import { createSignal } from "solid-js";
import { Mic, Pen, Keyboard, Send, X } from "lucide-solid";

type PromptMode = "text" | "voice" | "sketch";

interface PromptInputProps {
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

export default function PromptInput(props: PromptInputProps) {
  const [mode, setMode] = createSignal<PromptMode>("text");
  const [text, setText] = createSignal("");
  const [recording, setRecording] = createSignal(false);

  const submit = () => {
    const value = text().trim();
    if (!value) return;
    props.onSubmit(value);
    setText("");
  };

  const toggleRecord = () => {
    setRecording((r) => !r);
    if (recording()) {
      setText("Voice prompt placeholder");
    }
  };

  return (
    <div class="fixed inset-x-0 bottom-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 p-4 pb-8 safe-area-pb">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-semibold text-white">Add prompt (optional)</span>
        <button onClick={props.onCancel} class="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      <div class="flex gap-2 mb-3">
        <ModeButton active={mode() === "text"} onClick={() => setMode("text")} icon={Keyboard} label="Text" />
        <ModeButton active={mode() === "voice"} onClick={() => setMode("voice")} icon={Mic} label="Voice" />
        <ModeButton active={mode() === "sketch"} onClick={() => setMode("sketch")} icon={Pen} label="Sketch" />
      </div>

      {mode() === "text" && (
        <textarea
          value={text()}
          onInput={(e) => setText(e.currentTarget.value)}
          placeholder="Comment or instruction before action..."
          class="w-full h-24 rounded-xl bg-gray-800 text-white p-3 text-sm resize-none border border-gray-700 focus:border-indigo-500 focus:outline-none"
        />
      )}

      {mode() === "voice" && (
        <div class="flex flex-col items-center justify-center h-24 rounded-xl bg-gray-800 border border-gray-700">
          <button
            onClick={toggleRecord}
            class={`h-12 w-12 rounded-full flex items-center justify-center transition ${
              recording() ? "bg-rose-500 animate-pulse" : "bg-indigo-500"
            } text-white`}
          >
            <Mic size={24} />
          </button>
          <span class="text-xs text-gray-400 mt-2">{recording() ? "Recording... tap to stop" : "Tap to record"}</span>
        </div>
      )}

      {mode() === "sketch" && (
        <div class="h-24 rounded-xl bg-gray-800 border border-dashed border-gray-600 flex items-center justify-center">
          <span class="text-xs text-gray-400">Sketch canvas (tap to draw)</span>
        </div>
      )}

      <div class="flex justify-end mt-3">
        <button
          onClick={submit}
          disabled={!text().trim()}
          class="flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          <Send size={16} />
          Attach prompt
        </button>
      </div>
    </div>
  );
}

function ModeButton(props: {
  active: boolean;
  onClick: () => void;
  icon: typeof Keyboard;
  label: string;
}) {
  return (
    <button
      onClick={props.onClick}
      class={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
        props.active
          ? "bg-indigo-500 text-white"
          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
      }`}
    >
      {(() => {
        const Icon = props.icon;
        return <Icon size={14} />;
      })()}
      {props.label}
    </button>
  );
}
