import { For } from "solid-js";
import { ArrowRight, GitPullRequest, Layers, MessageSquare, Rocket, Sparkles } from "lucide-solid";

const stages = [
  {
    key: "idea",
    label: "Idea",
    icon: Sparkles,
    color: "indigo",
    desc: "An issue or PR becomes a scored card.",
  },
  {
    key: "work",
    label: "Work",
    icon: Rocket,
    color: "emerald",
    desc: "Approved cards spawn an implementation task.",
  },
  {
    key: "merge",
    label: "Merge",
    icon: GitPullRequest,
    color: "orange",
    desc: "Tests pass and the PR is merged.",
  },
  {
    key: "release",
    label: "Release",
    icon: Layers,
    color: "purple",
    desc: "Evidence is collected and shipped.",
  },
];

export default function Pipeline() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative overflow-hidden">
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
            The ship pipeline
          </h2>
          <p class="text-zinc-400 max-w-2xl mx-auto">
            Every idea walks through the same four stages. At each stage a new
            card is created and tracked.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-6 items-stretch">
          <For each={stages}>
            {(stage, i) => {
              const Icon = stage.icon;
              const colors: Record<string, string> = {
                indigo: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
                emerald: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
                orange: "border-orange-500/30 text-orange-400 bg-orange-500/10",
                purple: "border-purple-500/30 text-purple-400 bg-purple-500/10",
              };
              const isLast = i() === stages.length - 1;
              return (
                <>
                  <div class="rounded-2xl bg-zinc-900/60 p-6 border border-zinc-800 hover:border-indigo-500/40 transition group relative">
                    <div class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 text-xs font-bold">
                      {i() + 1}
                    </div>
                    <div
                      class={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 border ${colors[stage.color]}`}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 class="text-lg font-semibold text-white mb-2">
                      {stage.label}
                    </h3>
                    <p class="text-zinc-400 text-sm leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                  {!isLast && (
                    <div class="hidden lg:flex items-center justify-center">
                      <ArrowRight size={24} class="text-zinc-600" />
                    </div>
                  )}
                </>
              );
            }}
          </For>
        </div>

        <div class="mt-16 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-6 sm:p-10 overflow-x-auto">
          <div class="min-w-[48rem] flex items-center justify-between gap-4">
            <For each={stages}>
              {(stage, i) => {
                const Icon = stage.icon;
                const isLast = i() === stages.length - 1;
                return (
                  <>
                    <div class="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 p-4 flex items-center gap-3 shadow-lg">
                      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Icon size={20} />
                      </div>
                      <div>
                        <div class="text-sm font-semibold text-white">{stage.label} card</div>
                        <div class="text-xs text-zinc-500">score: {8.4 + i() * 0.2}</div>
                      </div>
                    </div>
                    {!isLast && (
                      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 shrink-0">
                        <ArrowRight size={16} />
                      </div>
                    )}
                  </>
                );
              }}
            </For>
          </div>
        </div>
      </div>
    </section>
  );
}
