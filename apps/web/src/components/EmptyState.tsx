import type { JSX } from "solid-js";
import type { LucideIcon } from "lucide-solid";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: JSX.Element;
}

export default function EmptyState(props: Props) {
  const Icon = props.icon;
  return (
    <div class="rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-10 text-center">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 dark:text-indigo-300 mb-5">
        <Icon size={28} />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-1">{props.title}</h3>
      <p class="text-sm text-gray-500 dark:text-zinc-400 mb-5 max-w-md mx-auto">{props.description}</p>
      {props.action}
    </div>
  );
}
