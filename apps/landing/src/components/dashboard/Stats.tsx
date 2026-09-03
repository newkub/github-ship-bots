import { For } from "solid-js";
import { stats } from "./data";

export default function Stats() {
  return (
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <For each={stats}>
        {(stat) => {
          const Icon = stat.icon;
          return (
            <div class="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 flex items-center gap-3 hover:border-indigo-500/30 hover:-translate-y-0.5 transition duration-300">
              <div class={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.class}`}>
                <Icon size={20} />
              </div>
              <div>
                <div class="text-xl font-bold text-white">{stat.value}</div>
                <div class="text-xs text-zinc-400">{stat.label}</div>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}
