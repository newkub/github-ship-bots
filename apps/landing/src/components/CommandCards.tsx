import { For } from "solid-js";
import { CheckCircle2, Rocket, Terminal, XCircle } from "lucide-solid";
import { commands } from "../data";
import SectionHeader from "./SectionHeader";
import VisualBlock from "./VisualBlock";

const iconMap: Record<string, typeof CheckCircle2> = {
  "/approve": CheckCircle2,
  "/reject": XCircle,
  "/ship": Rocket,
};

const styleMap: Record<string, { icon: string; border: string }> = {
  "/approve": {
    icon: "from-emerald-500/25 to-emerald-500/5 text-emerald-300 border-emerald-500/30",
    border: "border-emerald-500/30 hover:border-emerald-500/50",
  },
  "/reject": {
    icon: "from-rose-500/25 to-rose-500/5 text-rose-300 border-rose-500/30",
    border: "border-rose-500/30 hover:border-rose-500/50",
  },
  "/ship": {
    icon: "from-indigo-500/25 to-indigo-500/5 text-indigo-300 border-indigo-500/30",
    border: "border-indigo-500/30 hover:border-indigo-500/50",
  },
};

export default function CommandCards() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-orange-500/8 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="Commands"
          subtitle="Vote with a comment. The bot reads the command and advances the card through the pipeline."
        />

        <div class="max-w-2xl mx-auto mb-12">
          <VisualBlock variant="commands" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <For each={commands}>
            {(cmd) => {
              const Icon = iconMap[cmd.cmd] ?? Terminal;
              const style = styleMap[cmd.cmd] ?? {
                icon: "from-indigo-500/25 to-indigo-500/5 text-indigo-300 border-indigo-500/30",
                border: "border-indigo-500/30 hover:border-indigo-500/50",
              };
              return (
                <div
                  class={`relative rounded-2xl bg-zinc-900/60 p-8 border ${style.border} hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-indigo-500/10 transition group overflow-hidden`}
                >
                  <div class="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-white/10 to-transparent rounded-tr-2xl rounded-bl-[5rem] opacity-0 group-hover:opacity-100 transition" />

                  <div class="relative flex items-center gap-3 mb-6">
                    <div
                      class={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${style.icon} group-hover:scale-110 transition`}
                    >
                      <Icon size={24} />
                    </div>
                    <code class="text-2xl font-bold text-white font-mono">
                      {cmd.cmd}
                    </code>
                  </div>

                  <div class="relative space-y-3 text-zinc-400 text-sm">
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
