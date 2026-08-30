import { A, useLocation } from "@solidjs/router";
import { useQuery } from "@tanstack/solid-query";
import { Home, GitBranch, CreditCard, MousePointer, Settings, LogIn, LogOut } from "lucide-solid";
import { fetchSession, loginUrl } from "../api";
import { Show } from "solid-js";

export default function Layout(props: { children?: any }) {
  const loc = useLocation();
  const session = useQuery(() => ({ queryKey: ["session"], queryFn: fetchSession }));
  const user = () => session.data?.user;

  const nav = (href: string, icon: typeof Home, label: string) => {
    const active = loc.pathname === href;
    return (
      <A
        href={href}
        class={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
          active ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        {(() => {
          const Icon = icon;
          return <Icon size={18} />;
        })()}
        {label}
      </A>
    );
  };

  return (
    <div class="flex h-screen bg-gray-50">
      <aside class="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div class="flex items-center gap-2 px-4 mb-8">
          <img src="/icon-192x192.png" alt="ship-feed" class="w-8 h-8" />
          <span class="font-bold text-lg">ship-feed</span>
        </div>

        <nav class="space-y-1 flex-1">
          {nav("/", Home, "Cards")}
          {nav("/repos", GitBranch, "Repositories")}
          {nav("/billing", CreditCard, "Billing")}
          {nav("/inspector", MousePointer, "Web Inspector")}
          {nav("/settings", Settings, "Settings")}
        </nav>

        <div class="border-t border-gray-200 pt-4">
          <Show
            when={user()}
            fallback={
              <a
                href={loginUrl()}
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <LogIn size={18} />
                Sign in with GitHub
              </a>
            }
          >
            <div class="px-4 py-2">
              <div class="text-sm font-medium">{user()?.githubLogin ?? "User"}</div>
              <div class="text-xs text-gray-500 capitalize">{user()?.plan ?? "free"} plan</div>
            </div>
          </Show>
        </div>
      </aside>

      <main class="flex-1 overflow-auto p-8">{props.children}</main>
    </div>
  );
}
