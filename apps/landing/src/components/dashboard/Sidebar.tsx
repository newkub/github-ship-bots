import { For } from "solid-js";
import { GitBranch, GitPullRequest, LayoutDashboard, Rocket, Settings, Shield } from "lucide-solid";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Cards", icon: GitPullRequest, active: false },
  { label: "Repositories", icon: GitBranch, active: false },
  { label: "Settings", icon: Settings, active: false },
];

export default function Sidebar() {
  return (
    <div class="hidden lg:flex flex-col gap-2 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 h-fit">
      <div class="flex items-center gap-2 px-2 py-2 mb-2">
        <div class="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
          <Rocket size={18} />
        </div>
        <span class="font-bold text-white">ship-feed</span>
      </div>
      <For each={items}>
        {(item) => {
          const Icon = item.icon;
          return (
            <div
              class={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                item.active
                  ? "bg-indigo-500/10 text-indigo-400"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </div>
          );
        }}
      </For>
      <div class="mt-auto pt-4 border-t border-zinc-800">
        <div class="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400">
          <Shield size={16} class="text-emerald-400" />
          Guardrails on
        </div>
      </div>
    </div>
  );
}
