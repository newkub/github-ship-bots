import { A } from "@solidjs/router";
import { useQuery, useQueryClient } from "@tanstack/solid-query";
import {
  GitBranch,
  CreditCard,
  MousePointer,
  Puzzle,
  Settings,
  LogOut,
  LayoutDashboard,
  AlertCircle,
  User,
} from "lucide-solid";
import { fetchSession, loginUrl, logout } from "../api";
import Skeleton from "./Skeleton";
import { Show, createEffect, type JSX } from "solid-js";

export default function Layout(props: { children?: JSX.Element }) {
  const queryClient = useQueryClient();
  const session = useQuery(() => ({ queryKey: ["session"], queryFn: fetchSession }));
  const user = () => session.data?.user;

  createEffect(() => {
    if (!session.isPending && !user()) {
      // Not authenticated and session resolved: redirect to WorkOS login.
      window.location.href = loginUrl();
    }
  });

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
    <div class="flex h-screen bg-gray-50">
      <aside class="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <A href="/" class="flex items-center gap-2 px-4 mb-8">
          <img src="/dashboard/icon-192x192.png" alt="ship-feed" class="w-8 h-8" />
          <span class="font-bold text-lg">ship-feed</span>
        </A>

        <Show when={session.isPending}>
          <div class="flex-1 flex flex-col gap-4 px-2">
            <Skeleton class="h-10 w-full" />
            <Skeleton class="h-10 w-full" />
            <Skeleton class="h-10 w-full" />
            <Skeleton class="h-10 w-full" />
            <Skeleton class="h-10 w-full" />
            <Skeleton class="h-10 w-full" />
          </div>
        </Show>

        <Show when={!session.isPending}>
          <Show when={user()} fallback={null}>
            <nav class="space-y-1 flex-1">
              {nav("/", LayoutDashboard, "Dashboard")}
              {nav("/repos", GitBranch, "Repositories")}
              {nav("/billing", CreditCard, "Billing")}
              {nav("/inspector", MousePointer, "Inspector")}
              {nav("/marketplace", Puzzle, "Marketplace")}
              {nav("/settings", Settings, "Settings")}
            </nav>

            <div class="border-t border-gray-200 pt-4">
              <div class="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 mb-2">
                <div class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shrink-0">
                  <User size={18} />
                </div>
                <div class="min-w-0 flex-1">
                  <div class="text-sm font-medium truncate text-gray-900">{user()?.githubLogin ?? "User"}</div>
                  <div class="text-[10px] uppercase tracking-wide font-semibold text-indigo-600">{user()?.plan ?? "free"}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                class="flex w-full items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>
          </Show>
        </Show>
      </aside>

      <main class="flex-1 overflow-auto p-8">
        <Show when={session.error}>
          <div class="rounded-2xl bg-rose-50 border border-rose-100 p-6 text-rose-700 mb-6 flex items-start gap-3">
            <AlertCircle size={20} class="shrink-0 mt-0.5" />
            <div>
              <p class="font-medium">Failed to verify your session</p>
              <p class="text-sm mt-1">{(session.error as Error).message}</p>
              <a href={loginUrl()} class="inline-flex items-center gap-2 mt-3 text-sm font-medium underline hover:no-underline">
                Sign in again
              </a>
            </div>
          </div>
        </Show>
        <Show when={user()}>{props.children}</Show>
      </main>
    </div>
  );
}
