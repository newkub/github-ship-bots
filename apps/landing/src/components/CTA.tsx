import { Rocket } from "lucide-solid";
import ExternalLink from "./ExternalLink";

export default function CTA() {
  return (
    <section class="py-24 sm:py-32 rounded-2xl bg-orange-500/10 p-8 sm:p-12 text-center border border-orange-500/30">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-white mb-6 shadow-lg shadow-orange-500/20">
        <Rocket size={32} />
      </div>
      <h2 class="text-3xl sm:text-4xl font-bold text-white mb-3">
        Ready to ship faster?
      </h2>
      <p class="text-zinc-300 mb-8 max-w-xl mx-auto">
        Install the GitHub App, open your first issue, and start voting with
        /approve and /reject.
      </p>
      <ExternalLink
        href="https://github.com/apps/wrikka-ship-bot"
        class="inline-flex items-center justify-center rounded-xl bg-orange-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition"
      >
        Install on GitHub
      </ExternalLink>
    </section>
  );
}
