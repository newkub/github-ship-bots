import { For } from "solid-js";
import { ArrowRight, GitPullRequest, Layers, Rocket, Sparkles } from "lucide-solid";
import SectionHeader from "./SectionHeader";

const stages = [
  { key: "idea", label: "Idea", icon: Sparkles, color: "from-indigo-500/25 to-indigo-500/5 text-indigo-300 border-indigo-500/30", desc: "An issue or PR becomes a scored card." },
  { key: "work", label: "Work", icon: Rocket, color: "from-emerald-500/25 to-emerald-500/5 text-emerald-300 border-emerald-500/30", desc: "Approved cards spawn an implementation task." },
  { key: "merge", label: "Merge", icon: GitPullRequest, color: "from-orange-500/25 to-orange-500/5 text-orange-300 border-orange-500/30", desc: "Tests pass and the PR is merged." },
  { key: "release", label: "Release", icon: Layers, color: "from-purple-500/25 to-purple-500/5 text-purple-300 border-purple-500/30", desc: "Evidence is collected and shipped." },
];

export default function Pipeline() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-500/8 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="The ship pipeline"
          subtitle="Every idea walks through the same four stages. At each stage a new card is created and tracked."
        />

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-6 items-stretch">
          <For each={stages}>
            {(stage, i) => {
              const Icon = stage.icon;
              const isLast = i() === stages.length - 1;
              return (
                <>
                  <div class="relative rounded-2xl bg-zinc-900/60 p-6 border border-zinc-800 hover:border-indigo-500/40 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-indigo-500/5 transition group overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-tr-2xl rounded-bl-[4rem] opacity-0 group-hover:opacity-100 transition" />

                    <div class={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xs font-bold transition group-hover:border-indigo-500/30 group-hover:text-indigo-400`}>
                      {i() + 1}
                    </div>
                    <div
                      class={`relative flex h-12 w-12 items-center justify-center rounded-2xl mb-4 border bg-gradient-to-br ${stage.color} group-hover:scale-110 transition`}
                    >
                      <Icon size={24} />
                    </div>
                    <h3 class="relative text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition">
                      {stage.label}
                    </h3>
                    <p class="relative text-zinc-400 text-sm leading-relaxed">
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

        <div class="mt-16 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/60 p-6 sm:p-10 overflow-x-auto">
          <div class="min-w-[42rem] flex items-center justify-between gap-4">
            <For each={stages}>
              {(stage, i) => {
                const Icon = stage.icon;
                const isLast = i() === stages.length - 1;
                return (
                  <>
                    <div class="flex-1 rounded-xl bg-zinc-950 border border-zinc-800 p-4 flex items-center gap-3 shadow-lg hover:border-indigo-500/30 hover:bg-zinc-900/50 transition group">
                      <div class={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${stage.color} group-hover:scale-110 transition`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div class="text-sm font-semibold text-white">{stage.label} card</div>
                        <div class="text-xs text-zinc-500">score: {(8.4 + i() * 0.2).toFixed(1)}</div>
                      </div>
                    </div>
                    {!isLast && (
                      <div class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 shrink-0 group-hover:text-indigo-400 transition">
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
