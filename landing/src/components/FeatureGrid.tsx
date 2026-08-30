import { For } from "solid-js";
import { features } from "../data";

export default function FeatureGrid() {
  return (
    <section class="py-24 sm:py-32">
      <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">
        What it does
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <For each={features}>
          {(item) => {
            const Icon = item.icon;
            return (
              <div class="rounded-2xl bg-zinc-900/70 p-6 sm:p-8 shadow-lg border border-zinc-800 hover:border-orange-500/50 transition">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 mb-5">
                  <Icon size={24} />
                </div>
                <h3 class="text-xl font-semibold text-white">{item.title}</h3>
                <p class="mt-3 text-zinc-400 leading-relaxed">{item.body}</p>
              </div>
            );
          }}
        </For>
      </div>
    </section>
  );
}
