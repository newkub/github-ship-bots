import { For } from "solid-js";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ExternalLink,
  Layers,
  MessageSquare,
  Rocket,
} from "lucide-solid";
import { appName, dashboardUrl, installUrl } from "../data";
import SectionHeader from "./SectionHeader";

const steps = [
  { icon: Layers, text: "Ideas become cards" },
  { icon: MessageSquare, text: "Humans approve or reject" },
  { icon: Bot, text: "Agents implement" },
  { icon: CheckCircle2, text: "Evidence is collected" },
  { icon: Rocket, text: "Ship and learn" },
];

const concepts = [
  {
    title: "Card",
    body: "A single, scorable unit of work that humans approve or reject with one tap.",
  },
  {
    title: "Evidence",
    body: "Tests, screenshots, logs, and oracle results attached to every ship before it reaches production.",
  },
  {
    title: "Learning",
    body: "Weights update from each outcome so future cards are scored with better impact and risk estimates.",
  },
];

export default function About() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="rounded-3xl bg-zinc-900/50 p-8 sm:p-14 border border-zinc-800/60 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <SectionHeader
            title={`What is ${appName}?`}
            subtitle={`${appName} is a card-driven approval layer for software development. Every idea, pull request, merge, and release is a card. Humans choose and vote. The system handles implementation, verification, evidence, shipping, and learning.`}
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] gap-4 items-center">
            <For each={steps}>
              {(step, i) => {
                const Icon = step.icon;
                const isLast = i() === steps.length - 1;
                return (
                  <>
                    <div class="relative rounded-2xl bg-zinc-950/50 p-5 border border-zinc-800 text-center hover:border-indigo-500/30 hover:bg-zinc-900/60 hover:-translate-y-1 transition duration-300 group">
                      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500 mb-3 group-hover:scale-110 group-hover:bg-indigo-500/20 transition duration-300">
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

          <div class="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <For each={concepts}>
              {(concept) => (
                <div class="rounded-2xl bg-zinc-950/50 p-6 border border-zinc-800 hover:border-indigo-500/30 hover:-translate-y-1 hover:bg-zinc-900/40 transition duration-300 group">
                  <div class="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition">
                    {concept.title}
                  </div>
                  <p class="text-sm text-zinc-400 leading-relaxed">{concept.body}</p>
                </div>
              )}
            </For>
          </div>

          <div class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={installUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 hover:-translate-y-0.5 active:scale-95 transition"
            >
              <ExternalLink size={18} />
              Install GitHub App
            </a>
            <a
              href={dashboardUrl}
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-800 px-6 py-3.5 text-base font-semibold text-white hover:bg-zinc-700 hover:-translate-y-0.5 active:scale-95 transition"
            >
              <Rocket size={18} />
              Open Dashboard
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
