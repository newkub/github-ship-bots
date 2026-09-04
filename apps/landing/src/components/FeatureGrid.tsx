import { For } from "solid-js";
import { features } from "../data";
import SectionHeader from "./SectionHeader";
import VisualBlock from "./VisualBlock";

const palette = [
  "from-indigo-500/20 to-indigo-500/5 text-indigo-300 border-indigo-500/30",
  "from-purple-500/20 to-purple-500/5 text-purple-300 border-purple-500/30",
  "from-emerald-500/20 to-emerald-500/5 text-emerald-300 border-emerald-500/30",
  "from-orange-500/20 to-orange-500/5 text-orange-300 border-orange-500/30",
  "from-pink-500/20 to-pink-500/5 text-pink-300 border-pink-500/30",
  "from-cyan-500/20 to-cyan-500/5 text-cyan-300 border-cyan-500/30",
  "from-rose-500/20 to-rose-500/5 text-rose-300 border-rose-500/30",
  "from-amber-500/20 to-amber-500/5 text-amber-300 border-amber-500/30",
];

const colorClass = (i: number) => palette[i % palette.length];

export default function FeatureGrid() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-purple-500/8 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="Why ship-feed?"
          subtitle="The fastest way from idea to shipped code. The bot does the work, you make the call."
        />

        <div class="max-w-xl mx-auto mb-12">
          <VisualBlock variant="features" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-min grid-flow-dense">
          <For each={features}>
            {(feature, i) => {
              const Icon = feature.icon;
              const isHero = i() === 0;
              const isWide = i() === 5;
              const span =
                (isHero ? "sm:col-span-2 sm:row-span-2" : "") +
                (isWide ? " sm:col-span-2" : "");
              return (
                <div
                  class={`relative rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/40 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-indigo-500/5 transition group overflow-hidden ${span}`}
                >
                  <div class="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition" />
                  <div class={`absolute top-0 right-0 ${isHero ? "w-40 h-40" : "w-24 h-24"} bg-gradient-to-br from-white/10 to-transparent rounded-tr-2xl rounded-bl-[4rem] opacity-0 group-hover:opacity-100 transition`} />

                  <div class="relative p-6 sm:p-8 h-full flex flex-col">
                    <div
                      class={`flex items-center justify-center rounded-2xl bg-gradient-to-br ${colorClass(i())} ${
                        isHero ? "h-14 w-14 mb-6" : "h-12 w-12 mb-5"
                      } group-hover:scale-110 transition`}
                    >
                      <Icon size={isHero ? 28 : 24} />
                    </div>
                    <h3
                      class={`font-semibold text-white mb-2 group-hover:text-indigo-300 transition ${
                        isHero ? "text-2xl" : "text-xl"
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      class={`text-zinc-400 leading-relaxed ${
                        isHero ? "text-base" : "text-sm"
                      }`}
                    >
                      {feature.body}
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
