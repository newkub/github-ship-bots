import { For } from "solid-js";
import { Bot, CheckCircle2, ChevronRight, Layers, MessageSquare, Rocket } from "lucide-solid";
import { WindowChrome } from "../VisualBlock";

const steps = [
  { label: "Idea", icon: Layers, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  { label: "Vote", icon: MessageSquare, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { label: "Implement", icon: Bot, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { label: "Verify", icon: CheckCircle2, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { label: "Ship", icon: Rocket, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
];

const metrics = [
  { label: "Impact", value: "High", color: "text-emerald-400" },
  { label: "Risk", value: "Low", color: "text-rose-400" },
  { label: "Score", value: "8.4", color: "text-indigo-400" },
];

export default function AboutVisual() {
  return (
    <WindowChrome title="ship-feed">
      <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] gap-2 items-center">
        <For each={steps}>
          {(step, i) => {
            const Icon = step.icon;
            const isLast = i() === steps.length - 1;
            return (
              <>
                <div class={`rounded-xl border p-3 ${step.color} bg-zinc-950 flex flex-col items-center text-center gap-2`}>
                  <Icon size={18} />
                  <div class="text-xs font-semibold">{step.label}</div>
                </div>
                {!isLast && (
                  <div class="hidden sm:flex justify-center text-zinc-700">
                    <ChevronRight size={16} />
                  </div>
                )}
              </>
            );
          }}
        </For>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-2">
        <For each={metrics}>
          {(m) => (
            <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-2.5 text-center">
              <div class="text-[10px] text-zinc-500 uppercase">{m.label}</div>
              <div class={`text-sm font-semibold ${m.color}`}>{m.value}</div>
            </div>
          )}
        </For>
      </div>
    </WindowChrome>
  );
}
