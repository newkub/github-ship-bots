import { For } from "solid-js";
import { ChevronRight, Rocket, Sparkles, ThumbsUp } from "lucide-solid";
import { WindowChrome } from "../VisualBlock";

export default function AboutVisual() {
  const steps = [
    { label: "Idea", icon: Sparkles, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
    { label: "Approve", icon: ThumbsUp, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { label: "Ship", icon: Rocket, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  ];
  return (
    <WindowChrome title="ship-feed">
      <div class="flex items-center gap-3">
        <For each={steps}>
          {(step, i) => {
            const Icon = step.icon;
            const last = i() === steps.length - 1;
            return (
              <>
                <div class={`flex-1 rounded-xl border p-3 ${step.color}`}>
                  <Icon size={18} class="mb-2" />
                  <div class="text-xs font-semibold">{step.label}</div>
                </div>
                {!last && <ChevronRight size={16} class="text-zinc-600" />}
              </>
            );
          }}
        </For>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-2">
        <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-center">
          <div class="text-[10px] text-zinc-500 uppercase">Card</div>
          <div class="text-xs text-zinc-300">scored</div>
        </div>
        <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-center">
          <div class="text-[10px] text-zinc-500 uppercase">Evidence</div>
          <div class="text-xs text-zinc-300">attached</div>
        </div>
        <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-center">
          <div class="text-[10px] text-zinc-500 uppercase">Learning</div>
          <div class="text-xs text-zinc-300">updated</div>
        </div>
      </div>
    </WindowChrome>
  );
}
