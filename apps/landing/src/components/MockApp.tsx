import { Send, ThumbsDown, ThumbsUp } from "lucide-solid";

export default function MockApp() {
  return (
    <div class="flex justify-center">
      <div class="relative w-56 sm:w-64 shrink-0">
        <div class="rounded-[2.5rem] bg-zinc-950 border-4 border-zinc-800 p-2 shadow-2xl">
          <div class="rounded-[2rem] bg-zinc-900 overflow-hidden h-[28rem] sm:h-[30rem] p-4 flex flex-col">
            <div class="h-1.5 w-16 mx-auto rounded-full bg-zinc-800 mb-4" />

            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-bold text-white">ship-feed</span>
              <div class="flex items-center gap-1.5">
                <div class="h-1 w-3 rounded-full bg-zinc-700" />
                <div class="h-2.5 w-1 rounded-sm bg-zinc-700" />
              </div>
            </div>

            <div class="flex flex-col gap-3 flex-1">
              <div class="rounded-2xl bg-zinc-950 border border-zinc-800 p-3">
                <label class="text-[10px] font-medium uppercase tracking-wide text-zinc-500 mb-1.5 block">
                  Prompt
                </label>
                <div class="flex items-center gap-2">
                  <input
                    type="text"
                    value="Add a dark mode toggle"
                    readOnly
                    class="flex-1 bg-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-200 border border-zinc-800 focus:outline-none"
                  />
                  <button class="h-8 w-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0">
                    <Send size={14} />
                  </button>
                </div>
              </div>

              <div class="flex-1 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border border-indigo-500/20 p-4 flex flex-col shadow-lg">
                <div class="text-xs font-bold uppercase tracking-wide text-indigo-300">
                  idea
                </div>
                <div class="mt-1 text-white font-semibold text-sm">
                  Add a dark mode toggle
                </div>
                <div class="mt-1 text-xs text-zinc-300">
                  impact high · risk low
                </div>

                <div class="mt-3 flex flex-wrap gap-2">
                  <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium">
                    score 8.4
                  </span>
                  <span class="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-medium">
                    evidence
                  </span>
                </div>

                <div class="flex-1" />

                <div class="grid grid-cols-2 gap-3 mt-4">
                  <button class="flex items-center justify-center gap-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-2 text-xs font-semibold hover:bg-rose-500/20 transition">
                    <ThumbsDown size={14} />
                    Reject
                  </button>
                  <button class="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-2 text-xs font-semibold hover:bg-emerald-500/20 transition">
                    <ThumbsUp size={14} />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="absolute -right-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 rounded-full bg-zinc-900/90 border border-zinc-800 px-2.5 py-1 text-xs text-zinc-300 shadow">
          <ThumbsUp size={12} class="text-emerald-400" />
          <span>swipe</span>
        </div>
      </div>
    </div>
  );
}
