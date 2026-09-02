import { ExternalLink, Rocket } from "lucide-solid";
import GitHubCard from "./GitHubCard";
import MockApp from "./MockApp";
import SectionHeader from "./SectionHeader";
import { dashboardUrl, installUrl } from "../data";

const steps = [
  {
    color: "text-emerald-400",
    label: "GitHub issue → card posted",
  },
  {
    color: "text-indigo-400",
    label: "Comment /approve or tap approve",
  },
  {
    color: "text-purple-400",
    label: "ship-feed implements, tests, and ships",
  },
];

export default function VisualDemo() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-purple-500/8 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <SectionHeader
              title="Vote from anywhere"
              subtitle="Comment on GitHub, tap a button in the web dashboard, or swipe on the mobile PWA. The same pipeline runs everywhere."
              align="left"
            />

            <ul class="space-y-5 mb-10">
              {steps.map((step, i) => (
                <li class="flex items-start gap-4 group">
                  <div class={`flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 ${step.color} mt-0.5 group-hover:border-indigo-500/30 transition`}>
                    <span class="text-xs font-bold">{i + 1}</span>
                  </div>
                  <p class="text-zinc-300 text-base leading-relaxed pt-0.5">{step.label}</p>
                </li>
              ))}
            </ul>

            <div class="flex flex-col sm:flex-row gap-4">
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

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div class="order-2 sm:order-1">
              <GitHubCard
                title="Add a dark mode toggle"
                type="issue"
                number={42}
                state="open"
                labels={[
                  { text: "idea", color: "orange" },
                  { text: "impact medium", color: "emerald" },
                ]}
                comment="/approve"
                botReply="Card approved and queued for implementation. Estimated score: 8.4"
              />
            </div>
            <div class="order-1 sm:order-2 flex justify-center">
              <MockApp />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
