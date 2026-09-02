import { For } from "solid-js";
import { features } from "../data";
import SectionHeader from "./SectionHeader";

export default function FeatureGrid() {
  const colorClass = (i: number) => {
    const palette = [
      "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
      "text-purple-400 bg-purple-500/10 border-purple-500/30",
      "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      "text-orange-400 bg-orange-500/10 border-orange-500/30",
    ];
    return palette[i % palette.length];
  };

  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-purple-500/8 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="Why ship-feed?"
          subtitle="The fastest way from idea to shipped code. The bot does the work, you make the call."
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <For each={features}>
            {(feature, i) => {
              const Icon = feature.icon;
              return (
                <div class="relative rounded-2xl bg-zinc-900/60 p-8 border border-zinc-800 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 hover:bg-zinc-900/80 transition duration-300 group">
                  <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-tr-2xl rounded-bl-[4rem] opacity-0 group-hover:opacity-100 transition duration-300" />
                  <div
                    class={`flex h-12 w-12 items-center justify-center rounded-xl mb-5 border ${colorClass(i())} group-hover:scale-110 transition duration-300`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 class="text-xl font-semibold text-white mb-2 group-hover:text-indigo-300 transition">
                    {feature.title}
                  </h3>
                  <p class="text-zinc-400 leading-relaxed text-sm">
                    {feature.body}
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
