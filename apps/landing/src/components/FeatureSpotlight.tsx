import { For } from "solid-js";
import { MessageSquare, Image, Rocket } from "lucide-solid";
import SectionHeader from "./SectionHeader";

const spotlights = [
  {
    title: "Vote with a comment",
    body: "Comment /approve, /reject, or /ship directly on GitHub. ship-feed listens to webhooks and updates the queue in real time.",
    icon: MessageSquare,
    gradient: "from-indigo-500 to-purple-600",
    shadow: "shadow-indigo-500/20",
    titleHover: "group-hover:text-indigo-400",
    dot: "bg-indigo-400",
    points: ["No context switching", "Works on issues and PRs", "Records who voted and when"],
  },
  {
    title: "Evidence that ships with the card",
    body: "Attach screenshots, logs, videos, and baselines. The oracle compares UI before and after so regressions don't reach production.",
    icon: Image,
    gradient: "from-emerald-500 to-cyan-600",
    shadow: "shadow-emerald-500/20",
    titleHover: "group-hover:text-emerald-400",
    dot: "bg-emerald-400",
    points: ["Image, video, and log evidence", "Baseline comparison", "Linked to every card"],
  },
  {
    title: "The ship loop",
    body: "Approved cards are picked up by the orchestrator, verified for mergeability, and shipped. Rejected cards are closed automatically.",
    icon: Rocket,
    gradient: "from-orange-500 to-rose-600",
    shadow: "shadow-orange-500/20",
    titleHover: "group-hover:text-orange-400",
    dot: "bg-orange-400",
    points: ["Continuous merge pipeline", "Mergeability checks", "Audit trail by default"],
  },
];

export default function FeatureSpotlight() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-emerald-500/6 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="Three ideas that change how you ship"
          subtitle="The fastest way from a GitHub issue to a merged, verified, and shipped pull request."
        />

        <div class="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <For each={spotlights}>
            {(item) => {
              const Icon = item.icon;
              return (
                <div class="group relative rounded-2xl bg-zinc-900/60 border border-zinc-800 p-8 hover:border-indigo-500/30 hover:bg-zinc-900/80 hover:shadow-xl hover:shadow-indigo-500/5 transition overflow-hidden">
                  <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-tr-2xl rounded-bl-[4rem] opacity-0 group-hover:opacity-100 transition" />

                  <div class={`relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg ${item.shadow} mb-6 group-hover:scale-110 transition`}>
                    <Icon size={28} />
                  </div>
                  <h3 class={`relative text-2xl font-bold text-white mb-3 ${item.titleHover} transition`}>
                    {item.title}
                  </h3>
                  <p class="relative text-zinc-400 text-sm leading-relaxed mb-6">
                    {item.body}
                  </p>
                  <ul class="relative space-y-2">
                    <For each={item.points}>
                      {(point) => (
                        <li class="flex items-start gap-2 text-sm text-zinc-300">
                          <span class={`mt-1.5 h-1.5 w-1.5 rounded-full ${item.dot}`} />
                          {point}
                        </li>
                      )}
                    </For>
                  </ul>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </section>
  );
}
