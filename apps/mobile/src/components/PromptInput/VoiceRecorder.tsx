import { Mic } from "lucide-solid";

interface VoiceRecorderProps {
  recording: () => boolean;
  toggleRecord: () => void;
}

export default function VoiceRecorder(props: VoiceRecorderProps) {
  return (
    <div class="flex flex-col items-center justify-center h-32 rounded-xl bg-elevated border border-divider">
      <button
        onClick={props.toggleRecord}
        class={`relative h-14 w-14 rounded-full flex items-center justify-center transition active:scale-95 ${
          props.recording() ? "bg-danger animate-pulse" : "bg-accent"
        } text-white shadow-lg`}
        aria-label={props.recording() ? "Stop recording" : "Start recording"}
      >
        <Mic size={28} />
        {props.recording() && <span class="absolute inset-0 rounded-full border border-white/30 animate-pulse-ring" />}
      </button>
      {props.recording() ? (
        <div class="flex items-end gap-1 h-6 mt-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              class="w-1 bg-accent rounded-full animate-wave"
              style={{
                height: "18px",
                "animation-delay": `${i * 90}ms`,
              }}
            />
          ))}
        </div>
      ) : null}
      <span class="text-xs text-muted mt-3">
        {props.recording() ? "Recording... tap to stop" : "Tap to record your comment"}
      </span>
    </div>
  );
}
