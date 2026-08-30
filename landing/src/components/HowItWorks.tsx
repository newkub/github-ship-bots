import { For } from "solid-js";
import { steps } from "../data";

export default function HowItWorks() {
  return (
    <section class="py-24 sm:py-32">
      <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">
        How to use
      </h2>
      <ol class="max-w-2xl mx-auto space-y-4">
        <For each={steps}>
          {(step, i) => {
            const Icon = step.icon;
            return (
              <li class="flex gap-4 items-start rounded-2xl bg-zinc-900/70 p-4 sm:p-5 border border-zinc-800">
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                  <Icon size={18} />
                </span>
                <div class="flex-1 pt-2">
                  <span class="text-zinc-300">{step.text}</span>
                </div>
                <span class="self-center text-2xl font-bold text-zinc-700">
                  {i() + 1}
                </span>
              </li>
            );
          }}
        </For>
      </ol>
    </section>
  );
}
