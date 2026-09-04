import { For } from "solid-js";
import { ArrowRight } from "lucide-solid";
import { steps } from "../data";
import SectionHeader from "./SectionHeader";
import ScrollReveal from "./ScrollReveal";
import VisualBlock from "./VisualBlock";

export default function HowItWorks() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <ScrollReveal>
          <SectionHeader
            title="How it works"
            subtitle="Four steps from repo connection to shipped code. The bot handles the busywork; you just decide."
          />
        </ScrollReveal>

        <ScrollReveal>
          <div class="max-w-xl mx-auto mb-12">
            <VisualBlock variant="how-it-works" />
          </div>
        </ScrollReveal>

        <ScrollReveal selector=".step-card" stagger={140}>
          <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-4 items-stretch">
            <For each={steps}>
              {(step, i) => {
                const Icon = step.icon;
                const isLast = i() === steps.length - 1;
                const number = `0${i() + 1}`;
                return (
                  <>
                    <div class="step-card relative rounded-2xl bg-zinc-900/60 p-6 border border-zinc-800 hover:border-indigo-500/40 hover:-translate-y-1 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-indigo-500/5 transition duration-300 group">
                      <div class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 text-xs font-bold group-hover:text-indigo-400 group-hover:border-indigo-500/30 group-hover:scale-110 transition duration-300">
                        {number}
                      </div>
                      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 transition duration-300">
                        <Icon size={24} />
                      </div>
                      <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition">
                        {step.title}
                      </h3>
                      <p class="text-zinc-400 text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                    {!isLast && (
                      <div class="step-connector flex items-center justify-center py-2 lg:py-0">
                        <div class="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 lg:rotate-0 rotate-90 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition">
                          <ArrowRight size={18} />
                        </div>
                      </div>
                    )}
                  </>
                );
              }}
            </For>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
