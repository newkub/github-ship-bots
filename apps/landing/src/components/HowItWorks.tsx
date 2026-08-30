import { For } from "solid-js";
import { steps } from "../data";
import GitHubCard from "./GitHubCard";

export default function HowItWorks() {
  return (
    <section class="py-24 sm:py-32">
      <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">
        How to use
      </h2>

      <div class="relative max-w-2xl mx-auto">
        <div class="absolute left-8 top-8 bottom-8 w-px bg-zinc-800" />

        <ul class="space-y-6">
          <For each={steps}>
            {(step, i) => {
              const Icon = step.icon;
              return (
                <li class="relative flex gap-5 pl-2">
                  <div class="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-zinc-900 border-2 border-orange-500 text-orange-400">
                    <Icon size={22} />
                  </div>
                  <div class="flex-1 pt-3">
                    <div class="rounded-2xl bg-zinc-900/70 p-5 border border-zinc-800">
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

        <div class="mt-12 rounded-2xl bg-zinc-900/70 p-6 border border-orange-500/30">
          <p class="text-center text-zinc-300 mb-6 font-medium">
            Example result after voting
          </p>
          <GitHubCard
            title="Add settings page"
            type="pull-request"
            state="merged"
            number={15}
            labels={[
              { text: "approved", color: "emerald" },
              { text: "ship-feed", color: "zinc" },
            ]}
            comment="/approve"
            botReply="Merged by github-ship-bots."
          />
        </div>
      </div>
    </section>
  );
}
