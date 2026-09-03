import { ChevronDown, ChevronUp, MessageSquarePlus, ThumbsDown, ThumbsUp } from "lucide-solid";

interface ControlsProps {
  expanded: boolean;
  prompt?: string;
  onToggleExpand: () => void;
  onAddPrompt: () => void;
  onReject: (e: MouseEvent) => void;
  onApprove: (e: MouseEvent) => void;
}

export default function Controls(props: ControlsProps) {
  return (
    <div class="flex justify-between items-center pt-1">
      <button
        data-no-swipe
        onClick={props.onReject}
        class="h-14 w-14 rounded-full bg-rose-500/90 backdrop-blur flex items-center justify-center text-white shadow-xl active:scale-90 transition border-2 border-white/20"
        aria-label="Reject"
      >
        <ThumbsDown size={28} />
      </button>

      <div class="flex items-center gap-3">
        <button
          data-no-swipe
          onClick={props.onAddPrompt}
          class={`h-12 w-12 rounded-full backdrop-blur flex items-center justify-center shadow-xl active:scale-90 transition border-2 border-white/20 ${
            props.prompt ? "bg-accent/80 text-white" : "bg-white/20 text-white"
          }`}
          aria-label="Add prompt"
        >
          <MessageSquarePlus size={22} />
        </button>

        <button
          data-no-swipe
          onClick={() => props.onToggleExpand()}
          class="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-white/90 active:scale-90 transition"
          aria-label="Expand"
        >
          {props.expanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </button>
      </div>

      <button
        data-no-swipe
        onClick={props.onApprove}
        class="h-14 w-14 rounded-full bg-emerald-500/90 backdrop-blur flex items-center justify-center text-white shadow-xl active:scale-90 transition border-2 border-white/20"
        aria-label="Approve"
      >
        <ThumbsUp size={28} />
      </button>
    </div>
  );
}
