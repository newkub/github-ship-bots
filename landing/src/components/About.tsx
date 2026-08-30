import { For } from "solid-js";
import { Bot, MessageSquare, MousePointerClick, ShieldCheck } from "lucide-solid";

const steps = [
  { icon: Bot, text: "Bot posts a voting card" },
  { icon: MousePointerClick, text: "Team comments /approve or /reject" },
  { icon: MessageSquare, text: "Bot labels and acts automatically" },
  { icon: ShieldCheck, text: "Decision is recorded and shipped" },
];

export default function About() {
  return (
    <section class="py-24 sm:py-32">
      <div class="rounded-2xl bg-zinc-900/70 p-6 sm:p-10 border border-zinc-800">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
            <Bot size={20} />
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold">What is ship-feed bot?</h2>
        </div>
        <p class="text-zinc-300 leading-relaxed mb-8">
          A GitHub App that turns every new issue and pull request into a simple
          card. Your team votes with a comment, and the bot handles labels,
          merging, and closing.
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <For each={steps}>
            {(step) => {
              const Icon = step.icon;
              return (
                <div class="flex items-center gap-3 rounded-xl bg-zinc-950/50 p-4 border border-zinc-800">
                  <Icon size={20} class="text-orange-400" />
                  <span class="text-zinc-300 text-sm">{step.text}</span>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </section>
  );
}
