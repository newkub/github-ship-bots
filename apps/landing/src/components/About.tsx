import { For } from "solid-js";
import { appName } from "../data";
import { ArrowRight, Bot, CheckCircle2, Layers, MessageSquare, Rocket, Search, ShieldCheck } from "lucide-solid";

const steps = [
  { icon: Layers, text: "Ideas become cards" },
  { icon: MessageSquare, text: "Humans approve or reject" },
  { icon: Bot, text: "Agents implement" },
  { icon: Search, text: "Evidence is collected" },
  { icon: CheckCircle2, text: "Tests pass and merge" },
  { icon: Rocket, text: "Ship and learn" },
];

export default function About() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="rounded-3xl bg-zinc-900/50 p-8 sm:p-14 border border-zinc-800/60 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div class="relative z-10 text-center mb-12">
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-5">
              What is {appName}?
            </h2>
            <p class="text-zinc-300 leading-relaxed text-lg max-w-3xl mx-auto">
              {appName} is a card-driven approval layer for software development.
              Every idea, pull request, merge, and release is a card. Humans only
              choose and vote. The system handles implementation, verification,
              evidence, shipping, and learning.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] gap-4 items-center">
            <For each={steps}>
              {(step, i) => {
                const Icon = step.icon;
                const isLast = i() === steps.length - 1;
                return (
                  <>
                    <div class="relative rounded-2xl bg-zinc-950/50 p-5 border border-zinc-800 text-center hover:border-indigo-500/30 transition group">
                      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 mb-3 group-hover:scale-110 transition">
                        <Icon size={24} />
                      </div>
                      <p class="text-zinc-200 text-sm font-medium">{step.text}</p>
                    </div>
                    {!isLast && (
                      <div class="hidden lg:flex justify-center">
                        <ArrowRight size={20} class="text-zinc-600" />
                      </div>
                    )}
                  </>
                );
              }}
            </For>
          </div>

          <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div class="rounded-2xl bg-zinc-950/50 p-5 border border-zinc-800">
              <div class="text-2xl font-bold text-white mb-1">Card</div>
              <p class="text-sm text-zinc-400">A single, scorable unit of work humans approve or reject.</p>
            </div>
            <div class="rounded-2xl bg-zinc-950/50 p-5 border border-zinc-800">
              <div class="text-2xl font-bold text-white mb-1">Evidence</div>
              <p class="text-sm text-zinc-400">Tests, screenshots, logs, and oracle results attached to every ship.</p>
            </div>
            <div class="rounded-2xl bg-zinc-950/50 p-5 border border-zinc-800">
              <div class="text-2xl font-bold text-white mb-1">Learning</div>
              <p class="text-sm text-zinc-400">Weights update from each outcome to score future cards better.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
