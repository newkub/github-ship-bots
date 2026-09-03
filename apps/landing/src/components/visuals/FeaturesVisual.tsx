import { For } from "solid-js";
import { Bot, Brain, ShieldCheck, Zap } from "lucide-solid";
import { WindowChrome } from "../VisualBlock";

export default function FeaturesVisual() {
  const items = [
    { label: "Fast", icon: Zap, color: "text-indigo-400 bg-indigo-500/10" },
    { label: "Smart", icon: Brain, color: "text-purple-400 bg-purple-500/10" },
    { label: "Auto", icon: Bot, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "Safe", icon: ShieldCheck, color: "text-orange-400 bg-orange-500/10" },
  ];
  return (
    <WindowChrome title="ship-feed / dashboard">
      <div class="grid grid-cols-2 gap-3">
        <For each={items}>
          {(item) => {
            const Icon = item.icon;
            return (
              <div class={`rounded-xl p-3 border border-zinc-800/60 ${item.color} bg-zinc-950`}>
                <Icon size={18} class="mb-1.5" />
                <div class="text-xs font-semibold">{item.label}</div>
              </div>
            );
          }}
        </For>
      </div>
      <div class="mt-3 rounded-lg bg-zinc-950 border border-zinc-800 p-3 flex items-center gap-3">
        <div class="h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">8.4</div>
        <div class="flex-1">
          <div class="text-xs text-zinc-300">Auto score for every card</div>
          <div class="text-[10px] text-zinc-500">impact · risk · effect</div>
        </div>
      </div>
    </WindowChrome>
  );
}
