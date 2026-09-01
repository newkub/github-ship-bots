import { For } from "solid-js";
import { steps } from "../data";

export default function HowItWorks() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative">
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
            How it works
          </h2>
          <p class="text-zinc-400 max-w-2xl mx-auto">
            Five steps from an idea to a shipped release. Every step produces a
            card that is visible on web and mobile.
          </p>
        </div>

        <div class="relative max-w-3xl mx-auto">
          <div class="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-indigo-500/30 via-zinc-700 to-transparent" />

          <ul class="space-y-6">
            <For each={steps}>
              {(step, i) => {
                const Icon = step.icon;
                return (
                  <li class="relative flex gap-5 pl-2">
                    <div class="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-900 border-2 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/10">
                      <Icon size={22} />
                    </div>
                    <div class="flex-1 pt-3">
                      <div class="rounded-2xl bg-zinc-900/60 p-5 border border-zinc-800 hover:border-indigo-500/30 transition">
                        <p class="text-zinc-200 font-medium mb-1">
                          {step.text}
                        </p>
                        <p class="text-sm text-zinc-500">
                          Step {i() + 1}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              }}
            </For>
          </ul>
        </div>
      </div>
    </section>
  );
}
