import { Rocket, Sparkles } from "lucide-solid";
import ExternalLink from "./ExternalLink";
import { appName } from "../data";

export default function CTA() {
  return (
    <section class="py-24 sm:py-32">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-10 sm:p-16 text-center border border-indigo-500/20 relative overflow-hidden">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2" />

          <div class="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500 text-white mb-6 shadow-lg shadow-indigo-500/20">
            <Rocket size={32} />
          </div>

          <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to ship cards?
          </h2>
          <p class="text-zinc-300 mb-8 max-w-xl mx-auto">
            Install the {appName} GitHub App, open your first issue, and turn your
            team&apos;s decisions into an autonomous shipping pipeline.
          </p>

          <ExternalLink
            href="https://github.com/apps/wrikka-ship-bot"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition"
          >
            <Sparkles size={20} />
            Install on GitHub
          </ExternalLink>
        </div>
      </div>
    </section>
  );
}
