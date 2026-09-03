import { For } from "solid-js";
import { GitPullRequest, Layers, Rocket, ThumbsUp } from "lucide-solid";
import { WindowChrome } from "../VisualBlock";

export default function HowItWorksVisual() {
  const steps = [
    { title: "Connect", icon: GitPullRequest, desc: "repo" },
    { title: "Rules", icon: Layers, desc: "policy" },
    { title: "Vote", icon: ThumbsUp, desc: "approve" },
    { title: "Ship", icon: Rocket, desc: "deploy" },
  ];
  return (
    <WindowChrome title="how it works">
      <div class="grid grid-cols-2 gap-3">
        <For each={steps}>
          {(step, i) => {
            const Icon = step.icon;
            return (
              <div class="rounded-xl bg-zinc-950 border border-zinc-800 p-3 hover:border-indigo-500/30 transition">
                <div class="flex items-center justify-between mb-2">
                  <Icon size={16} class="text-indigo-400" />
                  <span class="text-[10px] text-zinc-600 font-mono">0{i() + 1}</span>
                </div>
                <div class="text-xs font-semibold text-zinc-200">{step.title}</div>
                <div class="text-[10px] text-zinc-500">{step.desc}</div>
              </div>
            );
          }}
        </For>
      </div>
    </WindowChrome>
  );
}
