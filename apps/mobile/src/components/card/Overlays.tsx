import { Show } from "solid-js";
import { ThumbsDown, ThumbsUp } from "lucide-solid";

interface OverlaysProps {
  likeOpacity: number;
  nopeOpacity: number;
}

export default function Overlays(props: OverlaysProps) {
  return (
    <>
      <Show when={props.likeOpacity > 0}>
        <div
          class="absolute top-16 right-8 z-30 flex flex-col items-center justify-center rounded-2xl bg-emerald-500/90 text-white px-5 py-3 font-black tracking-widest uppercase shadow-xl border-2 border-white/30 pointer-events-none"
          style={{ opacity: props.likeOpacity, transform: `scale(${0.6 + props.likeOpacity * 0.4}) rotate(8deg)` }}
        >
          <ThumbsUp size={28} />
          <span class="text-sm mt-1">Approve</span>
        </div>
      </Show>

      <Show when={props.nopeOpacity > 0}>
        <div
          class="absolute top-16 left-8 z-30 flex flex-col items-center justify-center rounded-2xl bg-rose-500/90 text-white px-5 py-3 font-black tracking-widest uppercase shadow-xl border-2 border-white/30 pointer-events-none"
          style={{ opacity: props.nopeOpacity, transform: `scale(${0.6 + props.nopeOpacity * 0.4}) rotate(-8deg)` }}
        >
          <ThumbsDown size={28} />
          <span class="text-sm mt-1">Reject</span>
        </div>
      </Show>

      <div
        class="absolute inset-y-0 right-0 w-2/5 bg-gradient-to-l from-emerald-500/40 to-transparent pointer-events-none"
        style={{ opacity: props.likeOpacity * 0.7 }}
      />
      <div
        class="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-rose-500/40 to-transparent pointer-events-none"
        style={{ opacity: props.nopeOpacity * 0.7 }}
      />
    </>
  );
}
