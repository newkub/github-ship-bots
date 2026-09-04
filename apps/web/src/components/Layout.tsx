import { A } from "@solidjs/router";
import { useQuery, useQueryClient } from "@tanstack/solid-query";
import {
  GitBranch,
  CreditCard,
  FileText,
  MousePointer,
  Moon,
  Puzzle,
  Scale,
  Settings,
  Sun,
  LogOut,
  LayoutDashboard,
  User,
} from "lucide-solid";
import { fetchSession, logout } from "../api";
import { createTheme } from "../lib/theme";
import LoginScreen from "./LoginScreen";
import { Show, type JSX } from "solid-js";

export default function Layout(props: { children?: JSX.Element }) {
  const queryClient = useQueryClient();
  const session = useQuery(() => ({ queryKey: ["session"], queryFn: fetchSession }));
  const user = () => session.data?.user;
  const theme = createTheme();

  const handleLogout = async () => {
    await logout();
    queryClient.clear();
    window.location.href = "/";
  };

  const nav = (href: string, icon: typeof LayoutDashboard, label: string) => {
    const Icon = icon;
    return (
      <A
        href={href}
        activeClass="bg-indigo-50 text-indigo-700"
        inactiveClass="text-gray-600 hover:bg-gray-50"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium"
      >
        <Icon size={18} />
        {label}
      </A>
    );
  };

  return (
    <Show when={!session.isPending} fallback={
      <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-6">
        <div class="flex items-center gap-2 text-gray-500">
          <div class="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Loading…
        </div>
      </div>
    }>
      <Show when={user()} fallback={<LoginScreen error={session.error ? (session.error as Error).message : undefined} />}>
        <div class="flex h-screen bg-gray-50 dark:bg-zinc-950">
          <aside class="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-4 flex flex-col">
            <A href="/" class="flex items-center gap-2 px-4 mb-8">
              <img src="/dashboard/icon-192x192.png" alt="ship-feed" class="w-8 h-8" />
              <span class="font-bold text-lg text-gray-900 dark:text-white">ship-feed</span>
            </A>

            <nav class="space-y-1 flex-1">
              {nav("/", LayoutDashboard, "Dashboard")}
              {nav("/repos", GitBranch, "Repositories")}
              {nav("/releases", FileText, "Releases")}
              {nav("/rules", Scale, "Rules")}
              {nav("/billing", CreditCard, "Billing")}
              {nav("/inspector", MousePointer, "Inspector")}
              {nav("/marketplace", Puzzle, "Marketplace")}
              {nav("/settings", Settings, "Settings")}
            </nav>

            <div class="border-t border-gray-200 dark:border-zinc-800 pt-4">
              <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700 mb-2">
                <div class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <User size={18} />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-medium truncate text-gray-900 dark:text-white">{user()?.githubLogin ?? "User"}</div>
                  <div class="text-[10px] uppercase tracking-wide font-semibold text-indigo-600 dark:text-indigo-400">{user()?.plan ?? "free"}</div>
                </div>
              </div>
              <button
                onClick={theme.toggle}
                class="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg mb-1"
              >
                {theme.theme() === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                {theme.theme() === "dark" ? "Light mode" : "Dark mode"}
              </button>
              <button
                onClick={handleLogout}
                class="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>
          </aside>

          <main class="flex-1 overflow-auto p-8 dark:bg-zinc-950">
            {props.children}
          </main>
        </div>
      </Show>
    </Show>
  );
}
