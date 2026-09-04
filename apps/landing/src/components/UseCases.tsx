import { For } from "solid-js";
import { Check, Layers, MessageSquare, Rocket, ShieldCheck, Zap } from "lucide-solid";
import SectionHeader from "./SectionHeader";

const steps = [
  {
    icon: Layers,
    title: "Open an idea issue",
    desc: "Describe the feature in a GitHub issue. ship-feed turns it into a scored card with impact, risk, and effect.",
  },
  {
    icon: MessageSquare,
    title: "The team votes",
    desc: "Reviewers comment /approve or /reject. Votes, thresholds, and guardrails are recorded automatically.",
  },
  {
    icon: Zap,
    title: "Bot writes the code",
    desc: "Once approved, the bot generates a branch, commits, opens a PR, and attaches evidence for review.",
  },
  {
    icon: ShieldCheck,
    title: "Verify with evidence",
    desc: "Screenshots, baselines, and logs are checked before the PR is merged. Regressions are caught early.",
  },
  {
    icon: Rocket,
    title: "Auto ship",
    desc: "The orchestrator merges when safe and ships the release. No manual follow-up needed.",
  },
];

const outcomes = [
  "Ship multiple times a day without micromanaging",
  "Keep review context in one place",
  "Reduce production regressions with evidence",
];

export default function UseCases() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="A real shipping workflow"
          subtitle="From a GitHub issue to a shipped release, fully automated and fully auditable."
        />

        <div class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div class="space-y-4 relative">
            <div class="absolute left-7 top-8 bottom-8 w-px bg-gradient-to-b from-zinc-700 via-indigo-500/30 to-zinc-700 hidden lg:block" />
            <For each={steps}>
              {(step, i) => {
                const Icon = step.icon;
                return (
                  <div class="group relative flex gap-4 p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:bg-zinc-900/60 hover:border-indigo-500/30 transition">
                    <div class="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-700 text-indigo-400 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition">
                      <Icon size={22} />
                    </div>
                    <div>
                      <div class="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">Step {i() + 1}</div>
                      <h3 class="text-lg font-semibold text-white mb-1">{step.title}</h3>
                      <p class="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>

          <div class="rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-8 lg:sticky lg:top-8">
            <h3 class="text-2xl font-bold text-white mb-4">What you get</h3>
            <ul class="space-y-4">
              <For each={outcomes}>
                {(outcome) => (
                  <li class="flex items-start gap-3 text-zinc-300">
                    <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mt-0.5">
                      <Check size={14} />
                    </div>
                    <span class="leading-relaxed">{outcome}</span>
                  </li>
                )}
              </For>
            </ul>
            <div class="mt-8 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
              <p class="text-sm text-zinc-400 italic">
                "The bot does the work. You just decide."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
