import { For } from "solid-js";
import {
  Bot,
  CheckCircle2,
  ChevronRight,
  Gauge,
  Layers,
  MessageSquare,
  Rocket,
} from "lucide-solid";
import { WindowChrome } from "../VisualBlock";

const steps = [
  { label: "Idea", icon: Layers, color: "from-indigo-500/20 to-indigo-500/5 text-indigo-300" },
  { label: "Vote", icon: MessageSquare, color: "from-emerald-500/20 to-emerald-500/5 text-emerald-300" },
  { label: "Implement", icon: Bot, color: "from-purple-500/20 to-purple-500/5 text-purple-300" },
  { label: "Verify", icon: CheckCircle2, color: "from-amber-500/20 to-amber-500/5 text-amber-300" },
  { label: "Ship", icon: Rocket, color: "from-cyan-500/20 to-cyan-500/5 text-cyan-300" },
];

const metrics = [
  { label: "Impact", value: "High", color: "text-emerald-400" },
  { label: "Risk", value: "Low", color: "text-rose-400" },
  { label: "Score", value: "8.4", color: "text-indigo-400" },
];

export default function AboutVisual() {
  return (
    <WindowChrome title="ship-feed / pipeline">
      <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] gap-2 items-center">
        <For each={steps}>
          {(step, i) => {
            const Icon = step.icon;
            const isLast = i() === steps.length - 1;
            return (
              <>
                <div
                  class={`rounded-xl bg-gradient-to-br ${step.color} border border-white/10 p-3 bg-zinc-950 flex flex-col items-center text-center gap-2`}
                >
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
            <div class="rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-2.5 text-center">
              <div class="text-[10px] text-zinc-500 uppercase flex items-center justify-center gap-1">
                <Gauge size={10} />
                {m.label}
              </div>
              <div class={`text-sm font-semibold ${m.color}`}>{m.value}</div>
            </div>
          )}
        </For>
      </div>
    </WindowChrome>
  );
}
