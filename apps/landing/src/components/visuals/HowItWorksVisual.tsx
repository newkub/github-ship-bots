import { For } from "solid-js";
import { GitPullRequest, Layers, Rocket, ThumbsUp, ChevronRight } from "lucide-solid";
import { WindowChrome } from "../VisualBlock";

const steps = [
  { title: "Connect", desc: "GitHub App", icon: GitPullRequest, color: "from-indigo-500/25 to-indigo-500/5 text-indigo-300" },
  { title: "Rules", desc: "Set policy", icon: Layers, color: "from-purple-500/25 to-purple-500/5 text-purple-300" },
  { title: "Vote", desc: "/approve", icon: ThumbsUp, color: "from-emerald-500/25 to-emerald-500/5 text-emerald-300" },
  { title: "Ship", desc: "Verified", icon: Rocket, color: "from-cyan-500/25 to-cyan-500/5 text-cyan-300" },
];

export default function HowItWorksVisual() {
  return (
    <WindowChrome title="how it works">
      <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-2 items-center">
        <For each={steps}>
          {(step, i) => {
            const Icon = step.icon;
            const isLast = i() === steps.length - 1;
            return (
              <>
                <div class={`rounded-xl bg-gradient-to-br ${step.color} border border-white/10 p-3 flex flex-col gap-2`}>
                  <div class="flex items-center justify-between">
                    <Icon size={18} />
                    <span class="text-[10px] text-white/40 font-mono">0{i() + 1}</span>
                  </div>
                  <div class="text-sm font-semibold text-zinc-200">{step.title}</div>
                  <div class="text-[10px] text-zinc-500">{step.desc}</div>
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
        <div class="rounded-xl bg-zinc-900/60 border border-zinc-800 p-2.5 text-center">
          <div class="text-[10px] text-zinc-500 uppercase">Latency</div>
          <div class="text-sm font-semibold text-indigo-400">&lt;2s</div>
        </div>
        <div class="rounded-xl bg-zinc-900/60 border border-zinc-800 p-2.5 text-center">
          <div class="text-[10px] text-zinc-500 uppercase">Uptime</div>
          <div class="text-sm font-semibold text-emerald-400">99.9%</div>
        </div>
        <div class="rounded-xl bg-zinc-900/60 border border-zinc-800 p-2.5 text-center">
          <div class="text-[10px] text-zinc-500 uppercase">Evidence</div>
          <div class="text-sm font-semibold text-amber-400">Auto</div>
        </div>
      </div>
    </WindowChrome>
  );
}
