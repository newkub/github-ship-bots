import { CheckCircle2, Rocket, X } from "lucide-solid";
import { WindowChrome } from "../VisualBlock";

export default function InstallVisual() {
  return (
    <WindowChrome title="GitHub Marketplace">
      <div class="rounded-xl bg-zinc-950 border border-zinc-800 p-4 flex items-center gap-4">
        <div class="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400">
          <Rocket size={24} />
        </div>
        <div class="flex-1">
          <div class="text-sm font-semibold text-white">wrikka-ship-bot</div>
          <div class="text-xs text-zinc-500">Card-driven shipping assistant</div>
        </div>
        <div class="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-semibold">
          Install
        </div>
      </div>
      <div class="mt-3 grid grid-cols-3 gap-2 text-center">
        <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-2">
          <CheckCircle2 size={14} class="mx-auto text-emerald-400 mb-1" />
          <span class="text-[9px] text-zinc-500">Free plan</span>
        </div>
        <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-2">
          <CheckCircle2 size={14} class="mx-auto text-emerald-400 mb-1" />
          <span class="text-[9px] text-zinc-500">Unlimited repos</span>
        </div>
        <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-2">
          <X size={14} class="mx-auto text-zinc-500 mb-1" />
          <span class="text-[9px] text-zinc-500">No card needed</span>
        </div>
      </div>
    </WindowChrome>
  );
}
