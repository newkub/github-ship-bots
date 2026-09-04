import { For } from "solid-js";
import { GitPullRequest, LayoutDashboard, MessageSquare } from "lucide-solid";
import SectionHeader from "./SectionHeader";

const steps = [
  {
    icon: GitPullRequest,
    title: "Install the GitHub App",
    body: "Pick the repositories ship-feed can watch. The bot starts listening to issues and PRs immediately.",
    color: "from-indigo-500/20 to-indigo-500/5 text-indigo-300 border-indigo-500/30",
  },
  {
    icon: LayoutDashboard,
    title: "Open the dashboard",
    body: "See every card, filter by status, and review evidence from one realtime view.",
    color: "from-purple-500/20 to-purple-500/5 text-purple-300 border-purple-500/30",
  },
  {
    icon: MessageSquare,
    title: "Comment /approve",
    body: "Vote on GitHub or in the app. Approved cards enter the ship loop automatically.",
    color: "from-emerald-500/20 to-emerald-500/5 text-emerald-300 border-emerald-500/30",
  },
];

export default function InstallSteps() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="Get started in three taps"
          subtitle="Install, connect, and approve. The bot handles implementation, tests, and shipping."
        />

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <For each={steps}>
            {(step, i) => {
              const Icon = step.icon;
              return (
                <div class="group relative rounded-2xl bg-zinc-900/60 border border-zinc-800 p-8 hover:border-indigo-500/30 hover:bg-zinc-900/80 transition overflow-hidden">
                  <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-tr-2xl rounded-bl-[4rem] opacity-0 group-hover:opacity-100 transition" />

                  <div class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 text-xs font-bold group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition">
                    0{i() + 1}
                  </div>

                  <div class={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} mb-6 group-hover:scale-110 transition`}>
                    <Icon size={28} />
                  </div>

                  <h3 class="relative text-xl font-semibold text-white mb-3 group-hover:text-indigo-300 transition">
                    {step.title}
                  </h3>
                  <p class="relative text-zinc-400 text-sm leading-relaxed">
                    {step.body}
                  </p>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </section>
  );
}
