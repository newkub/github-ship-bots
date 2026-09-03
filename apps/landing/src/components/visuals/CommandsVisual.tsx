import { For } from "solid-js";
import { WindowChrome } from "../VisualBlock";

export default function CommandsVisual() {
  const lines = [
    { text: "/approve", color: "text-emerald-400" },
    { text: "/reject", color: "text-rose-400" },
    { text: "/ship", color: "text-indigo-400" },
  ];
  return (
    <WindowChrome title="terminal">
      <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-3 font-mono text-xs space-y-2">
        <div class="text-zinc-500">$ ship-feed --help</div>
        <For each={lines}>
          {(line) => (
            <div class="flex items-center gap-2">
              <span class="text-zinc-600">$</span>
              <span class={line.color}>{line.text}</span>
            </div>
          )}
        </For>
        <div class="text-zinc-500">// bot replies with card status</div>
      </div>
    </WindowChrome>
  );
}
