import { GitPullRequest, ThumbsDown, ThumbsUp } from "lucide-solid";

export function MockBrowser() {
  return (
    <div class="rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden w-full">
      <div class="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
        <div class="h-3 w-3 rounded-full bg-rose-500" />
        <div class="h-3 w-3 rounded-full bg-amber-500" />
        <div class="h-3 w-3 rounded-full bg-emerald-500" />
        <div class="ml-4 flex-1 rounded-md bg-zinc-900 px-3 py-1 text-xs text-zinc-500 truncate">
          ship-feed.newkubise.workers.dev/cards
        </div>
      </div>
      <div class="p-5 bg-zinc-950">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-sm font-semibold text-white">Pending cards</h4>
          <div class="flex gap-2">
            <span class="text-xs text-zinc-500">all</span>
            <span class="text-xs text-indigo-400">pending</span>
            <span class="text-xs text-zinc-500">approved</span>
          </div>
        </div>
        <div class="rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-4">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="text-xs font-bold uppercase tracking-wide text-indigo-400">work</div>
              <div class="mt-1 text-white font-medium">Implement dark mode</div>
              <div class="mt-1 text-xs text-zinc-400">impact high · risk low · phase mvp</div>
              <div class="mt-3 flex gap-2">
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">score 8.4</span>
                <span class="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-xs">evidence</span>
              </div>
            </div>
            <div class="flex gap-2">
              <button class="h-9 w-9 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition">
                <ThumbsUp size={16} />
              </button>
              <button class="h-9 w-9 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center hover:bg-rose-500/20 transition">
                <ThumbsDown size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MockPhone() {
  return (
    <div class="relative mx-auto w-48 sm:w-56 shrink-0">
      <div class="rounded-[2.5rem] bg-zinc-950 border-4 border-zinc-800 p-2 shadow-2xl">
        <div class="rounded-[2rem] bg-zinc-900 overflow-hidden h-80 sm:h-96 p-4 flex flex-col">
          <div class="h-1 w-16 mx-auto rounded-full bg-zinc-800 mb-4" />
          <div class="flex-1 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 p-4 flex flex-col justify-between shadow-lg">
            <div>
              <div class="text-xs font-bold uppercase tracking-wide text-indigo-300">idea</div>
              <div class="mt-1 text-white font-semibold text-sm">Mobile swipe cards</div>
              <div class="mt-1 text-xs text-zinc-300">impact high · risk medium</div>
            </div>
            <div class="flex justify-between items-center">
              <button class="h-10 w-10 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center">
                <ThumbsDown size={18} />
              </button>
              <button class="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <ThumbsUp size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute -right-4 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 rounded-full bg-zinc-900/90 border border-zinc-800 px-2 py-1 text-xs text-zinc-300 shadow">
        <GitPullRequest size={12} class="text-indigo-400" />
        <span>swipe</span>
      </div>
    </div>
  );
}

export default function MockApp() {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <MockBrowser />
      <div class="flex justify-center">
        <MockPhone />
      </div>
    </div>
  );
}
