import { Show, createSignal } from "solid-js";
import { useQuery } from "@tanstack/solid-query";
import { getSession, loginUrl, API_URL } from "../api";
import { enablePush, canPush } from "../lib/push";
import BottomNav from "../components/BottomNav";
import ThemeToggle from "../components/ThemeToggle";
import { LogIn, CreditCard, Bell, Info, User, CheckCircle2, XCircle } from "lucide-solid";

export default function Account() {
  const session = useQuery(() => ({ queryKey: ["session"], queryFn: getSession }));
  const user = () => session.data?.user as { githubLogin?: string; plan?: string } | undefined;
  const [pushStatus, setPushStatus] = createSignal<string | null>(null);
  const [pushEnabled, setPushEnabled] = createSignal(false);

  const handleEnablePush = async () => {
    const result = await enablePush();
    setPushStatus(result.ok ? "enabled" : result.reason ?? "failed");
    setPushEnabled(await canPush());
  };

  return (
    <div class="h-screen w-screen flex flex-col bg-app text-primary">
      <header class="pt-safe px-6 py-4 bg-surface border-b border-divider">
        <h1 class="text-xl font-bold">Account</h1>
      </header>

      <div class="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar">
        <Show when={session.isLoading}>
          <div class="h-40 flex items-center justify-center">
            <div class="h-10 w-10 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
          </div>
        </Show>

        <Show when={session.error}>
          <div class="rounded-2xl bg-surface border border-divider p-4 text-center">
            <p class="text-danger font-medium">Failed to load session</p>
            <p class="text-sm text-muted mt-1">{session.error?.message ?? "Check your connection."}</p>
          </div>
        </Show>

        <Show
          when={user()}
          fallback={
            <a
              href={loginUrl()}
              class="flex items-center gap-3 rounded-2xl bg-surface border border-divider p-4 active:scale-95 transition"
            >
              <div class="h-10 w-10 rounded-full bg-accent/15 flex items-center justify-center text-accent">
                <LogIn size={20} />
              </div>
              <div>
                <p class="font-semibold text-primary">Sign in with GitHub</p>
                <p class="text-sm text-muted">Sync your cards across devices</p>
              </div>
            </a>
          }
        >
          <div class="rounded-2xl bg-surface border border-divider p-4">
            <div class="flex items-center gap-3 mb-3">
              <div class="h-12 w-12 rounded-full bg-accent/15 flex items-center justify-center text-accent">
                <User size={24} />
              </div>
              <div>
                <p class="text-sm text-muted">Signed in as</p>
                <p class="text-lg font-semibold text-primary">{user()?.githubLogin ?? "ship-feed user"}</p>
              </div>
            </div>
            <span class="text-xs uppercase tracking-wide px-2.5 py-1 rounded-full bg-elevated text-muted border border-divider inline-block">
              {user()?.plan ?? "free"} plan
            </span>
          </div>
        </Show>

        <div class="rounded-2xl bg-surface border border-divider p-4">
          <div class="flex items-start gap-3 mb-3">
            <div class="h-10 w-10 rounded-full bg-elevated flex items-center justify-center text-muted mt-0.5">
              <CreditCard size={20} />
            </div>
            <div class="flex-1">
              <h2 class="font-semibold text-primary">Subscription</h2>
              <p class="text-sm text-muted mt-1">Upgrade to ship more cards and unlock AI evidence vault.</p>
            </div>
          </div>
          <a
            href={`${API_URL}/api/stripe/checkout`}
            class="block w-full text-center bg-success text-white font-semibold py-3 rounded-xl active:scale-95 transition shadow-lg"
          >
            Upgrade to Pro
          </a>
        </div>

        <Show when={user()}>
          <div class="rounded-2xl bg-surface border border-divider p-4">
            <div class="flex items-start gap-3 mb-3">
              <div class="h-10 w-10 rounded-full bg-elevated flex items-center justify-center text-muted mt-0.5">
                <Bell size={20} />
              </div>
              <div class="flex-1">
                <h2 class="font-semibold text-primary">Push Notifications</h2>
                <p class="text-sm text-muted mt-1">Get notified when new cards arrive and when ships complete.</p>
              </div>
            </div>
            <button
              onClick={handleEnablePush}
              class="block w-full text-center bg-accent text-white font-semibold py-3 rounded-xl active:scale-95 transition shadow-lg"
            >
              Enable Push
            </button>
            <Show when={pushStatus()}>
              <div class="flex items-center justify-center gap-1.5 mt-3 text-xs">
                {pushEnabled() || pushStatus() === "enabled" ? (
                  <>
                    <CheckCircle2 size={14} class="text-success" />
                    <span class="text-muted">Push {pushStatus()}</span>
                  </>
                ) : (
                  <>
                    <XCircle size={14} class="text-danger" />
                    <span class="text-muted">Push {pushStatus()}</span>
                  </>
                )}
              </div>
            </Show>
          </div>
        </Show>

        <div class="rounded-2xl bg-surface border border-divider p-4">
          <h2 class="font-semibold text-primary mb-1 flex items-center gap-2">
            <Info size={18} class="text-muted" />
            Preferences
          </h2>
          <p class="text-sm text-muted mb-4">Adjust the look and feel of the app.</p>
          <ThemeToggle />
        </div>

        <div class="rounded-2xl bg-surface border border-divider p-4">
          <h2 class="font-semibold text-primary mb-2">About</h2>
          <p class="text-sm text-muted">
            ship-feed turns issues and pull requests into swipeable cards so you can approve or reject with one gesture.
          </p>
        </div>
      </div>
      <BottomNav active="account" />
    </div>
  );
}
