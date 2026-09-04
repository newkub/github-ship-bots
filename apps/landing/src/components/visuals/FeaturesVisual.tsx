import { For } from "solid-js";
import { Bot, Brain, ShieldCheck, Zap, GitPullRequest, Image, Smartphone, CreditCard } from "lucide-solid";
import { WindowChrome } from "../VisualBlock";

const items = [
  { label: "Fast", icon: Zap, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  { label: "Smart", icon: Brain, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { label: "Auto", icon: Bot, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { label: "Safe", icon: ShieldCheck, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  { label: "GitHub", icon: GitPullRequest, color: "text-zinc-300 bg-zinc-800 border-zinc-700" },
  { label: "Evidence", icon: Image, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  { label: "Mobile", icon: Smartphone, color: "text-pink-400 bg-pink-500/10 border-pink-500/20" },
  { label: "Billing", icon: CreditCard, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
];

export default function FeaturesVisual() {
  return (
    <WindowChrome title="ship-feed / dashboard">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <For each={items}>
          {(item) => {
            const Icon = item.icon;
            return (
              <div class={`rounded-xl p-3 border border-zinc-800/60 ${item.color} bg-zinc-950 flex flex-col gap-2`}>
                <Icon size={18} />
                <div class="text-xs font-semibold">{item.label}</div>
              </div>
            );
          }}
        </For>
      </div>
      <div class="mt-3 rounded-lg bg-zinc-950 border border-zinc-800 p-3 flex items-center gap-3">
        <div class="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">8.4</div>
        <div class="flex-1">
          <div class="text-sm text-zinc-300">Auto score for every card</div>
          <div class="text-xs text-zinc-500">impact · risk · effect · phase</div>
        </div>
      </div>
    </WindowChrome>
  );
}
