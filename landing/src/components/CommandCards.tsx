import { CheckCircle2, XCircle } from "lucide-solid";

export default function CommandCards() {
  return (
    <section class="py-24 sm:py-32">
      <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">
        Commands
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div class="rounded-2xl bg-zinc-900/70 p-6 sm:p-8 border border-zinc-800 hover:border-emerald-500/50 transition">
          <div class="flex items-center gap-3 mb-5">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
            <code class="text-2xl font-bold text-white font-mono">/approve</code>
          </div>
          <p class="text-zinc-400 mb-6">Approve the idea or merge the pull request.</p>
          <ul class="space-y-3 text-zinc-300">
            <li class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-500" />
              On issue: adds <span class="text-emerald-400">approved</span> label
            </li>
            <li class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-500" />
              On pull request: merges with squash
            </li>
          </ul>
        </div>

        <div class="rounded-2xl bg-zinc-900/70 p-6 sm:p-8 border border-zinc-800 hover:border-rose-500/50 transition">
          <div class="flex items-center gap-3 mb-5">
            <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
              <XCircle size={32} />
            </div>
            <code class="text-2xl font-bold text-white font-mono">/reject</code>
          </div>
          <p class="text-zinc-400 mb-6">Reject the idea or block the pull request.</p>
          <ul class="space-y-3 text-zinc-300">
            <li class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-rose-500" />
              On issue: adds <span class="text-rose-400">rejected</span> label and closes
            </li>
            <li class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-rose-500" />
              On pull request: adds <span class="text-rose-400">rejected</span> label
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
