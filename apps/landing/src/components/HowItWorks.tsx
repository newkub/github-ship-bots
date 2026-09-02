import { For } from "solid-js";
import { ArrowRight } from "lucide-solid";
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
            Four steps from repo connection to shipped code. The bot handles the
            busywork; you just decide.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-4 items-stretch">
          <For each={steps}>
            {(step, i) => {
              const Icon = step.icon;
              const isLast = i() === steps.length - 1;
              const number = `0${i() + 1}`;
              return (
                <>
                  <div class="relative rounded-2xl bg-zinc-900/60 p-6 border border-zinc-800 hover:border-indigo-500/40 transition group">
                    <div class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 text-xs font-bold group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition">
                      {number}
                    </div>
                    <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4 group-hover:scale-110 transition">
                      <Icon size={24} />
                    </div>
                    <h3 class="text-lg font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p class="text-zinc-400 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                  {!isLast && (
                    <div class="flex items-center justify-center py-2 md:py-0">
                      <ArrowRight
                        size={24}
                        class="text-zinc-600 rotate-90 md:rotate-0"
                      />
                    </div>
                  )}
                </>
              );
            }}
          </For>
        </div>
      </div>
    </section>
  );
}
