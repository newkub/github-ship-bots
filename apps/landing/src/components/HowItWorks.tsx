import { For } from "solid-js";
import { ArrowRight } from "lucide-solid";
import { steps } from "../data";
import SectionHeader from "./SectionHeader";
import VisualBlock from "./VisualBlock";

const stepStyles = [
  { icon: "from-indigo-500/20 to-indigo-500/5 text-indigo-300 border-indigo-500/30", badge: "text-indigo-400" },
  { icon: "from-purple-500/20 to-purple-500/5 text-purple-300 border-purple-500/30", badge: "text-purple-400" },
  { icon: "from-emerald-500/20 to-emerald-500/5 text-emerald-300 border-emerald-500/30", badge: "text-emerald-400" },
  { icon: "from-cyan-500/20 to-cyan-500/5 text-cyan-300 border-cyan-500/30", badge: "text-cyan-400" },
];

export default function HowItWorks() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="How it works"
          subtitle="Four steps from repo connection to shipped code. The bot handles the busywork; you just decide."
        />

        <div class="max-w-2xl mx-auto mb-12">
          <VisualBlock variant="how-it-works" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-4 items-stretch">
          <For each={steps}>
            {(step, i) => {
              const Icon = step.icon;
              const isLast = i() === steps.length - 1;
              const number = `0${i() + 1}`;
              const style = stepStyles[i() % stepStyles.length];
              return (
                <>
                  <div class="relative rounded-2xl bg-zinc-900/60 p-6 border border-zinc-800 hover:border-indigo-500/40 hover:bg-zinc-900/80 transition group overflow-hidden">
                    <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-tr-2xl rounded-bl-[4rem] opacity-0 group-hover:opacity-100 transition" />

                    <div class={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xs font-bold transition group-hover:border-indigo-500/30 ${style.badge}`}>
                      {number}
                    </div>

                    <div class={`flex h-12 w-12 items-center justify-center rounded-2xl mb-4 border bg-gradient-to-br ${style.icon} group-hover:scale-110 transition`}>
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
                      <div class="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition">
                        <ArrowRight size={18} />
                      </div>
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
