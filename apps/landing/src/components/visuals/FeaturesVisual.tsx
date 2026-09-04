import { For } from "solid-js";
import {
  Bot,
  Brain,
  GitPullRequest,
  Image,
  Monitor,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-solid";
import { WindowChrome } from "../VisualBlock";

const groups = [
  { label: "Fast", icon: Zap, color: "from-indigo-500/25 to-indigo-500/5 text-indigo-300" },
  { label: "Smart", icon: Brain, color: "from-purple-500/25 to-purple-500/5 text-purple-300" },
  { label: "Auto", icon: Bot, color: "from-emerald-500/25 to-emerald-500/5 text-emerald-300" },
  { label: "Safe", icon: ShieldCheck, color: "from-orange-500/25 to-orange-500/5 text-orange-300" },
  { label: "GitHub", icon: GitPullRequest, color: "from-zinc-500/20 to-zinc-500/5 text-zinc-300" },
  { label: "Evidence", icon: Image, color: "from-cyan-500/25 to-cyan-500/5 text-cyan-300" },
  { label: "Mobile", icon: Smartphone, color: "from-pink-500/25 to-pink-500/5 text-pink-300" },
  { label: "Dashboard", icon: Monitor, color: "from-amber-500/25 to-amber-500/5 text-amber-300" },
];

export default function FeaturesVisual() {
  return (
    <WindowChrome title="ship-feed / dashboard">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <For each={groups}>
          {(item, i) => {
            const Icon = item.icon;
            const wide = i() === 0 || i() === 5;
            return (
              <div
                class={`rounded-xl p-3 border border-white/10 bg-gradient-to-br ${item.color} flex flex-col gap-2 ${
                  wide ? "sm:col-span-2" : ""
                }`}
              >
                <Icon size={18} />
                <div class="text-xs font-semibold">{item.label}</div>
              </div>
            );
          }}
        </For>
      </div>

      <div class="mt-3 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-3 flex items-center gap-3">
        <div class="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
          8.4
        </div>
        <div class="flex-1">
          <div class="text-sm text-zinc-300">Auto score for every card</div>
          <div class="text-xs text-zinc-500">impact · risk · effect · phase</div>
        </div>
        <div class="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
          <Zap size={16} />
        </div>
      </div>
    </WindowChrome>
  );
}
