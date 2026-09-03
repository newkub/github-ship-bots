import { Server } from "lucide-solid";

export default function Health() {
  return (
    <div class="mt-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-4 flex items-center gap-3">
      <Server size={18} class="text-emerald-400" />
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-white">Worker health</div>
        <div class="text-xs text-zinc-500">All queues running · last heartbeat 2s ago</div>
      </div>
      <span class="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Healthy
      </span>
    </div>
  );
}
