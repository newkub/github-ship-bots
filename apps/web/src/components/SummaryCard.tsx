import type { LucideIcon } from "lucide-solid";

export default function SummaryCard(props: {
  label: string;
  value: number;
  icon: LucideIcon;
  color: "gray" | "emerald" | "rose" | "indigo";
  active: boolean;
  onClick: () => void;
}) {
  const colors = {
    gray: "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700",
    emerald: "bg-emerald-50 dark:bg-zinc-800 border-emerald-200 dark:border-zinc-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-zinc-700",
    rose: "bg-rose-50 dark:bg-zinc-800 border-rose-200 dark:border-zinc-700 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-zinc-700",
    indigo: "bg-indigo-50 dark:bg-zinc-800 border-indigo-200 dark:border-zinc-700 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-zinc-700",
  };
  const Icon = props.icon;

  return (
    <button
      onClick={props.onClick}
      class={`text-left rounded-2xl border p-4 transition ${colors[props.color]} ${props.active ? "ring-2 ring-offset-2 ring-indigo-500" : ""}`}
    >
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold uppercase tracking-wide opacity-80">{props.label}</span>
        <Icon size={16} class="opacity-60" />
      </div>
      <div class="text-2xl font-bold">{props.value}</div>
    </button>
  );
}
