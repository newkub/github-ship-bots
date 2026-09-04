import { For } from "solid-js";
import { GitPullRequest, Layers, Rocket, ThumbsUp, ChevronRight } from "lucide-solid";
import { WindowChrome } from "../VisualBlock";

const steps = [
  { title: "Connect", desc: "GitHub App", icon: GitPullRequest, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  { title: "Rules", desc: "Set policy", icon: Layers, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { title: "Vote", desc: "/approve", icon: ThumbsUp, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { title: "Ship", desc: "Verified", icon: Rocket, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
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
                <div class={`rounded-xl bg-zinc-950 border p-3 ${step.color} flex flex-col gap-2`}>
                  <div class="flex items-center justify-between">
                    <Icon size={18} />
                    <span class="text-[10px] text-zinc-600 font-mono">0{i() + 1}</span>
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
    </WindowChrome>
  );
}
