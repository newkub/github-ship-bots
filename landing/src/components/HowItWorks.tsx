import { For } from "solid-js";
import { steps } from "../data";

export default function HowItWorks() {
  return (
    <section class="py-24 sm:py-32">
      <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">
        How it works
      </h2>
      <ol class="max-w-2xl mx-auto space-y-4">
        <For each={steps}>
          {(step, i) => (
            <li class="flex gap-4 items-start rounded-2xl bg-zinc-900/70 p-4 sm:p-5 border border-zinc-800">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                {i() + 1}
              </span>
              <span class="text-zinc-300 pt-1">{step.text}</span>
            </li>
          )}
        </For>
      </ol>
    </section>
  );
}
