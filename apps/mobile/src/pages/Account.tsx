import { Show, createSignal } from "solid-js";
import { useQuery } from "@tanstack/solid-query";
import { getSession, loginUrl } from "../api";
import { enablePush } from "../lib/push";
import BottomNav from "../components/BottomNav";

export default function Account() {
  const session = useQuery(() => ({ queryKey: ["session"], queryFn: getSession }));
  const user = () => session.data?.user as { githubLogin?: string; plan?: string } | undefined;
  const [pushStatus, setPushStatus] = createSignal<string | null>(null);

  return (
    <div class="h-screen w-screen flex flex-col bg-gray-950 text-white">
      <header class="pt-safe px-6 py-4 bg-gray-900 border-b border-gray-800">
        <h1 class="text-xl font-bold">Account</h1>
      </header>
      <div class="flex-1 p-6 space-y-6">
        <Show
          when={user()}
          fallback={
            <a
              href={loginUrl()}
              class="block w-full text-center bg-indigo-600 text-white font-semibold py-3 rounded-xl"
            >
              Sign in with GitHub
            </a>
          }
        >
          <div class="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div class="text-sm text-gray-400">Signed in as</div>
            <div class="text-lg font-semibold">{user()?.githubLogin ?? "ship-feed user"}</div>
            <div class="mt-2 text-xs uppercase tracking-wide px-2 py-1 rounded-full bg-gray-800 inline-block">
              {user()?.plan ?? "free"} plan
            </div>
          </div>
        </Show>

        <div class="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h2 class="font-semibold mb-2">Subscription</h2>
          <p class="text-sm text-gray-400 mb-4">Upgrade to ship more cards and unlock AI evidence vault.</p>
          <a
            href="https://github-ship-bots.newkubise.workers.dev/api/stripe/checkout"
            class="block w-full text-center bg-emerald-600 text-white font-semibold py-3 rounded-xl"
          >
            Upgrade to Pro
          </a>
        </div>

        <Show when={user()}>
          <div class="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <h2 class="font-semibold mb-2">Push Notifications</h2>
            <p class="text-sm text-gray-400 mb-4">Get notified when new cards arrive and when ships complete.</p>
            <button
              onClick={async () => {
                const result = await enablePush();
                setPushStatus(result.ok ? "enabled" : result.reason ?? "failed");
              }}
              class="block w-full text-center bg-indigo-600 text-white font-semibold py-3 rounded-xl"
            >
              Enable Push
            </button>
            <Show when={pushStatus()}>
              <p class="text-xs text-center mt-2 text-gray-400">{pushStatus()}</p>
            </Show>
          </div>
        </Show>

        <div class="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <h2 class="font-semibold mb-2">About</h2>
          <p class="text-sm text-gray-400">ship-feed turns issues and pull requests into swipeable cards so you can approve or reject with one gesture.</p>
        </div>
      </div>
      <BottomNav active="account" />
    </div>
  );
}
