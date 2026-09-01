import MockApp from "./MockApp";

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

          <MockApp />
        </div>
      </div>
    </section>
  );
}
