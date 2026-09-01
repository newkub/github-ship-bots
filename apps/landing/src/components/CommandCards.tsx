import { For } from "solid-js";
import { CheckCircle2, Rocket, Terminal, XCircle } from "lucide-solid";
import { commands } from "../data";

const iconMap: Record<string, any> = {
  "/approve": CheckCircle2,
  "/reject": XCircle,
  "/ship": Rocket,
};

const colorMap: Record<string, string> = {
  "/approve": "emerald",
  "/reject": "rose",
  "/ship": "indigo",
};

export default function CommandCards() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative">
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
            Commands
          </h2>
          <p class="text-zinc-400 max-w-2xl mx-auto">
            Vote with a comment. The bot reads the command and advances the card
            through the pipeline.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <For each={commands}>
            {(cmd) => {
              const Icon = iconMap[cmd.cmd] ?? Terminal;
              const color = colorMap[cmd.cmd] ?? "indigo";
              const light = `bg-${color}-500/10 text-${color}-400`;
              const border = `border-${color}-500/30 hover:border-${color}-500/50`;
              return (
                <div
                  class={`rounded-2xl bg-zinc-900/60 p-8 border border-zinc-800 transition ${border}`}
                >
                  <div class="flex items-center gap-3 mb-6">
                    <div
                      class={`flex h-12 w-12 items-center justify-center rounded-2xl ${light}`}
                    >
                      <Icon size={24} />
                    </div>
                    <code class="text-2xl font-bold text-white font-mono">
                      {cmd.cmd}
                    </code>
                  </div>

                  <div class="space-y-3 text-zinc-400 text-sm">
                    <p>
                      <span class="text-zinc-500">Issue:</span> {cmd.issue}
                    </p>
                    <p>
                      <span class="text-zinc-500">Pull request:</span> {cmd.pr}
                    </p>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </section>
  );
}
