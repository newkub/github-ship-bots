import { GitBranch, Rocket } from "lucide-solid";
import { loginUrl } from "../api";

interface Props {
  error?: string | null;
}

export default function LoginScreen(props: Props) {
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-6">
      <div class="w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 p-8 shadow-xl">
        <div class="flex items-center gap-3 mb-8">
          <img src="/dashboard/icon-192x192.png" alt="ship-feed" class="w-10 h-10" />
          <span class="font-bold text-2xl text-gray-900 dark:text-white">ship-feed</span>
        </div>

        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to ship-feed
        </h1>
        <p class="text-sm text-gray-500 dark:text-zinc-400 mb-8 leading-relaxed">
          Approve, reject, and ship GitHub issues and pull requests from a card-driven dashboard.
        </p>

        <a
          href={loginUrl()}
          class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white hover:bg-indigo-700 active:scale-95 transition"
        >
          <GitBranch size={20} />
          Sign in with GitHub
        </a>

        <div class="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 dark:text-zinc-500">
          <Rocket size={16} />
          Card-driven autonomous development
        </div>

        {props.error && (
          <div class="mt-6 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 p-4 text-sm text-rose-700 dark:text-rose-300">
            {props.error}
          </div>
        )}
      </div>
    </div>
  );
}
