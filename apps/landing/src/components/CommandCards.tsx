import { For } from "solid-js";
import { CheckCircle2, Rocket, Terminal, XCircle } from "lucide-solid";
import { commands } from "../data";
import SectionHeader from "./SectionHeader";

const iconMap: Record<string, typeof CheckCircle2> = {
  "/approve": CheckCircle2,
  "/reject": XCircle,
  "/ship": Rocket,
};

const styleMap: Record<string, { light: string; border: string; glow: string }> = {
  "/approve": {
    light: "bg-emerald-500/10 text-emerald-400",
    border: "border-emerald-500/30 hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    glow: "group-hover:shadow-emerald-500/10",
  },
  "/reject": {
    light: "bg-rose-500/10 text-rose-400",
    border: "border-rose-500/30 hover:border-rose-500/50 hover:shadow-rose-500/10",
    glow: "group-hover:shadow-rose-500/10",
  },
  "/ship": {
    light: "bg-indigo-500/10 text-indigo-400",
    border: "border-indigo-500/30 hover:border-indigo-500/50 hover:shadow-indigo-500/10",
    glow: "group-hover:shadow-indigo-500/10",
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

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <For each={commands}>
            {(cmd) => {
              const Icon = iconMap[cmd.cmd] ?? Terminal;
              const style = styleMap[cmd.cmd] ?? {
                light: "bg-indigo-500/10 text-indigo-400",
                border: "border-indigo-500/30 hover:border-indigo-500/50 hover:shadow-indigo-500/10",
                glow: "group-hover:shadow-indigo-500/10",
              };
              return (
                <div
                  class={`rounded-2xl bg-zinc-900/60 p-8 border border-zinc-800 hover:-translate-y-1 hover:bg-zinc-900/80 hover:shadow-lg transition duration-300 group ${style.border} ${style.glow}`}
                >
                  <div class="flex items-center gap-3 mb-6">
                    <div
                      class={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.light} group-hover:scale-110 transition duration-300`}
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
