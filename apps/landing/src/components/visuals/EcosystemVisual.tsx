import { For } from "solid-js";
import { Brain, Database, Eye, MessageSquare, Monitor, Rocket, Smartphone } from "lucide-solid";
import { WindowChrome } from "../VisualBlock";

export default function EcosystemVisual() {
  const nodes = [
    { label: "GitHub bot", icon: MessageSquare },
    { label: "Mobile PWA", icon: Smartphone },
    { label: "Web dashboard", icon: Monitor },
    { label: "Evidence vault", icon: Database },
    { label: "Test oracle", icon: Eye },
    { label: "Learning", icon: Brain },
  ];
  return (
    <WindowChrome title="ecosystem">
      <div class="relative h-48">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 z-10">
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
                class="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div class="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                  <Icon size={14} />
                </div>
                <span class="text-[9px] text-zinc-500 whitespace-nowrap">{node.label}</span>
              </div>
            );
          }}
        </For>
      </div>
    </WindowChrome>
  );
}
