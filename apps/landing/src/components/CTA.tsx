import { ExternalLink, Rocket, Sparkles } from "lucide-solid";
import { dashboardUrl, installUrl } from "../data";
import SectionHeader from "./SectionHeader";

export default function CTA() {
  return (
    <section class="py-24 sm:py-32 relative">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-10 sm:p-16 text-center border border-indigo-500/20 relative overflow-hidden">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2" />
          <div class="absolute -bottom-32 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

          <div class="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500 text-white mb-6 shadow-lg shadow-indigo-500/20 animate-ring-pulse">
            <Rocket size={32} />
          </div>

          <SectionHeader
            title="Start shipping now"
            subtitle="Install ship-feed on your repositories and turn every idea into an autonomous shipping pipeline."
          />

          <div class="mt-2 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={installUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-indigo-500/40 active:scale-95 transition"
            >
              <Sparkles size={20} />
              Install GitHub App
            </a>
            <a
              href={dashboardUrl}
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-800 px-8 py-4 text-lg font-semibold text-white hover:bg-zinc-700 hover:-translate-y-0.5 active:scale-95 transition"
            >
              <ExternalLink size={20} />
              Open Dashboard
            </a>
          </div>

          <p class="mt-6 text-sm text-zinc-500">
            Free to install. Ships from your own repositories.
          </p>
        </div>
      </div>
    </section>
  );
}
