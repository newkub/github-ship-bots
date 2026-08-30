import { createQuery } from "@tanstack/solid-query";
import { Show } from "solid-js";
import { fetchAppInfo } from "../data";
import ExternalLink from "./ExternalLink";

export default function AppStatus() {
  const appQuery = createQuery(() => ({
    queryKey: ["app-info"],
    queryFn: fetchAppInfo,
  }));

  return (
    <section class="py-24 sm:py-32">
      <div class="rounded-2xl bg-zinc-900/70 p-6 sm:p-10 border border-zinc-800">
        <h2 class="text-2xl font-bold mb-4">App status</h2>
        <Show when={appQuery.isLoading}>
          <p class="text-zinc-400">Loading app info...</p>
        </Show>
        <Show when={appQuery.isError}>
          <p class="text-rose-400">Could not load app info from GitHub.</p>
        </Show>
        <Show when={!appQuery.isLoading && !appQuery.isError}>
          <p class="text-zinc-300">
            <ExternalLink
              href={appQuery.data?.html_url ?? "#"}
              class="text-orange-400 hover:text-orange-300 font-medium"
            >
              {appQuery.data?.name}
            </ExternalLink>
            <br />
            <span class="text-zinc-400">
              {appQuery.data?.description || "No description set yet."}
            </span>
          </p>
        </Show>
      </div>
    </section>
  );
}
