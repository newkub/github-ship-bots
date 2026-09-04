import { For } from "solid-js";
import { Activity, Box, GitPullRequest, Layers } from "lucide-solid";
import SectionHeader from "./SectionHeader";

const stats = [
  { value: 4, suffix: "", label: "Steps from idea to shipped code", icon: Layers },
  { value: 8, suffix: "", label: "Built-in production features", icon: Box },
  { value: 3, suffix: "", label: "Interfaces: dashboard, mobile, GitHub", icon: GitPullRequest },
  { value: 1, suffix: " bot", label: "Watches and ships for you", icon: Activity },
];

const iconStyles = [
  "from-indigo-500/20 to-indigo-500/5 text-indigo-300 border-indigo-500/30",
  "from-purple-500/20 to-purple-500/5 text-purple-300 border-purple-500/30",
  "from-emerald-500/20 to-emerald-500/5 text-emerald-300 border-emerald-500/30",
  "from-orange-500/20 to-orange-500/5 text-orange-300 border-orange-500/30",
];

export default function Stats() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/8 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="Built for speed and clarity"
          subtitle="Everything you need to ship continuously, without extra tooling."
        />

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <For each={stats}>
            {(stat, i) => {
              const Icon = stat.icon;
              return (
                <div class="relative rounded-2xl bg-zinc-900/60 border border-zinc-800 p-8 hover:border-indigo-500/30 hover:bg-zinc-900/80 transition group overflow-hidden">
                  <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-tr-2xl rounded-bl-[3rem] opacity-0 group-hover:opacity-100 transition" />
                  <div class={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${iconStyles[i() % iconStyles.length]} border mb-5 group-hover:scale-110 transition`}>
                    <Icon size={24} />
                  </div>
                  <div class="relative text-4xl sm:text-5xl font-extrabold text-white mb-2 tabular-nums">
                    {stat.value}
                    <span class="text-indigo-400 text-2xl sm:text-3xl">{stat.suffix}</span>
                  </div>
                  <p class="relative text-sm text-zinc-400 leading-relaxed">{stat.label}</p>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </section>
  );
}
