import { For } from "solid-js";
import { Brain, Database, Eye, MessageSquare, Monitor, Rocket, Smartphone } from "lucide-solid";
import { WindowChrome } from "../VisualBlock";

const nodes = [
  { label: "GitHub bot", icon: MessageSquare, color: "text-indigo-400" },
  { label: "Mobile PWA", icon: Smartphone, color: "text-emerald-400" },
  { label: "Web dashboard", icon: Monitor, color: "text-orange-400" },
  { label: "Evidence vault", icon: Database, color: "text-purple-400" },
  { label: "Test oracle", icon: Eye, color: "text-cyan-400" },
  { label: "Learning", icon: Brain, color: "text-pink-400" },
];

export default function EcosystemVisual() {
  return (
    <WindowChrome title="ecosystem">
      <div class="relative h-56">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-36 h-36 rounded-full border border-indigo-500/10" />
          <div class="absolute w-56 h-56 rounded-full border border-zinc-800" />
          <div class="absolute w-72 h-72 rounded-full border border-zinc-800/60" />
        </div>

        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/10 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 z-10">
          <Rocket size={24} />
        </div>

        <For each={nodes}>
          {(node, i) => {
            const Icon = node.icon;
            const angle = (i() / nodes.length) * 2 * Math.PI - Math.PI / 2;
            const x = 50 + 38 * Math.cos(angle);
            const y = 50 + 38 * Math.sin(angle);
            return (
              <div
                class="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div class="h-9 w-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-sm">
                  <Icon size={16} class={node.color} />
                </div>
                <span class="text-[10px] text-zinc-500 whitespace-nowrap">{node.label}</span>
              </div>
            );
          }}
        </For>
      </div>
    </WindowChrome>
  );
}
