import { Terminal } from "lucide-solid";

export default function VisualDemo() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative">
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
              Vote from anywhere
            </h2>
            <p class="text-zinc-400 leading-relaxed mb-6">
              Comment on GitHub, tap a button in the web dashboard, or swipe on
              the mobile PWA. The same pipeline runs everywhere.
            </p>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mt-0.5">
                  <span class="text-xs font-bold">1</span>
                </div>
                <p class="text-zinc-300 text-sm">GitHub issue → card posted.</p>
              </li>
              <li class="flex items-start gap-3">
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 mt-0.5">
                  <span class="text-xs font-bold">2</span>
                </div>
                <p class="text-zinc-300 text-sm">Comment <code class="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-200">/approve</code> or tap approve.</p>
              </li>
              <li class="flex items-start gap-3">
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 mt-0.5">
                  <span class="text-xs font-bold">3</span>
                </div>
                <p class="text-zinc-300 text-sm">ship-feed implements, tests, gathers evidence, and ships.</p>
              </li>
            </ul>
          </div>

          <div class="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden">
            <div class="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
              <div class="h-3 w-3 rounded-full bg-rose-500" />
              <div class="h-3 w-3 rounded-full bg-amber-500" />
              <div class="h-3 w-3 rounded-full bg-emerald-500" />
              <div class="ml-2 flex items-center gap-2 text-zinc-500 text-xs">
                <Terminal size={14} />
                <span>ship-feed ~ zsh</span>
              </div>
            </div>
            <div class="p-5 font-mono text-sm leading-relaxed overflow-x-auto">
              <p class="text-zinc-500">$ gh issue comment 2 -b "/approve"</p>
              <p class="text-emerald-400 mt-2">
                [ship-feed] approved idea #2
              </p>
              <p class="text-indigo-400">→ creating work card</p>
              <p class="text-indigo-400">→ running tests</p>
              <p class="text-indigo-400">→ collecting evidence</p>
              <p class="text-purple-400">→ shipped release v1.2.0</p>
              <p class="text-zinc-500 mt-4">$</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
