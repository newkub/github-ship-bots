import { For } from "solid-js";
import { CheckCircle2, Rocket, Terminal, XCircle } from "lucide-solid";
import { WindowChrome } from "../VisualBlock";

const commands = [
  { text: "/approve", color: "text-emerald-400", bg: "from-emerald-500/15 to-emerald-500/5", icon: CheckCircle2, reply: "approved · queued" },
  { text: "/reject", color: "text-rose-400", bg: "from-rose-500/15 to-rose-500/5", icon: XCircle, reply: "rejected · blocked" },
  { text: "/ship", color: "text-indigo-400", bg: "from-indigo-500/15 to-indigo-500/5", icon: Rocket, reply: "shipping · verifying" },
];

export default function CommandsVisual() {
  return (
    <WindowChrome title="terminal">
      <div class="rounded-xl bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm space-y-4">
        <For each={commands}>
          {(cmd) => {
            const Icon = cmd.icon;
            return (
              <div class="space-y-2">
                <div class="flex items-center gap-3">
                  <Terminal size={14} class="text-zinc-600" />
                  <span class="text-zinc-600">$</span>
                  <span class={`text-base font-semibold ${cmd.color}`}>{cmd.text}</span>
                </div>
                <div class={`ml-7 flex items-center gap-2 text-xs text-zinc-300 bg-gradient-to-r ${cmd.bg} rounded-lg px-3 py-2 border border-white/5`}>
                  <Icon size={14} class={cmd.color} />
                  <span>{cmd.reply}</span>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </WindowChrome>
  );
}
