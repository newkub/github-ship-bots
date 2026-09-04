import { For } from "solid-js";
import { CheckCircle2, Rocket, Shield, Star, Users } from "lucide-solid";
import { WindowChrome } from "../VisualBlock";

const perks = [
  { icon: CheckCircle2, label: "Free plan" },
  { icon: Users, label: "Unlimited repos" },
  { icon: Shield, label: "Private by default" },
  { icon: Star, label: "Pro upgrades" },
];

export default function InstallVisual() {
  return (
    <WindowChrome title="GitHub Marketplace">
      <div class="rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-4 flex items-center gap-4">
        <div class="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/10 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Rocket size={24} />
        </div>
        <div class="flex-1">
          <div class="text-sm font-semibold text-white">wrikka-ship-bot</div>
          <div class="text-xs text-zinc-500">Card-driven shipping assistant</div>
        </div>
        <div class="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20">
          Install
        </div>
      </div>

      <div class="mt-3 grid grid-cols-2 gap-2">
        <For each={perks}>
          {(perk) => {
            const Icon = perk.icon;
            return (
              <div class="rounded-xl bg-zinc-950 border border-zinc-800 p-2.5 flex items-center gap-2">
                <Icon size={14} class="text-emerald-400" />
                <span class="text-[10px] text-zinc-400">{perk.label}</span>
              </div>
            );
          }}
        </For>
      </div>
    </WindowChrome>
  );
}
