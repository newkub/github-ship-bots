import { For } from "solid-js";
import { CheckCircle2, Rocket, XCircle } from "lucide-solid";
import { WindowChrome } from "../VisualBlock";

const commands = [
  { text: "/approve", color: "text-emerald-400", icon: CheckCircle2, reply: "approved · queued" },
  { text: "/reject", color: "text-rose-400", icon: XCircle, reply: "rejected · blocked" },
  { text: "/ship", color: "text-indigo-400", icon: Rocket, reply: "shipping · verifying" },
];

export default function CommandsVisual() {
  return (
    <WindowChrome title="terminal">
      <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-4 font-mono text-sm space-y-3">
        <For each={commands}>
          {(cmd) => {
            const Icon = cmd.icon;
            return (
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="text-zinc-600">$</span>
                  <span class={cmd.color}>{cmd.text}</span>
                </div>
                <div class="ml-5 flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900 rounded-lg px-2.5 py-1.5 border border-zinc-800">
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
