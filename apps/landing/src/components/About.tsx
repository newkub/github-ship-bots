import { For } from "solid-js";
import { ArrowRight, Bot, MessageSquare, MousePointerClick, ShieldCheck } from "lucide-solid";

const steps = [
  { icon: Bot, text: "Open an issue or PR" },
  { icon: MessageSquare, text: "Bot posts a voting card" },
  { icon: MousePointerClick, text: "Comment /approve or /reject" },
  { icon: ShieldCheck, text: "Bot labels and ships" },
];

export default function About() {
  return (
    <section class="py-24 sm:py-32">
      <div class="rounded-2xl bg-zinc-900/70 p-6 sm:p-10 border border-zinc-800">
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-4">
          What is github-ship-bots?
        </h2>
        <p class="text-zinc-300 leading-relaxed text-center mb-10 max-w-2xl mx-auto">
          A GitHub App that turns every issue and pull request into a card. Your
          team votes with a comment, and the bot handles the rest.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-4 items-center">
          <For each={steps}>
            {(step, i) => {
              const Icon = step.icon;
              const isLast = i() === steps.length - 1;
              return (
                <>
                  <div class="relative rounded-2xl bg-zinc-950/50 p-5 border border-zinc-800 text-center">
                    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500 mb-3">
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
      </div>
    </section>
  );
}
