import { createQuery } from "@tanstack/solid-query";
import { For, Show } from "solid-js";

interface AppInfo {
  name: string;
  html_url: string;
  description: string | null;
}

async function fetchAppInfo(): Promise<AppInfo> {
  const res = await fetch("https://api.github.com/apps/wrikka-ship-bot");
  if (!res.ok) throw new Error("Failed to load app info");
  return res.json();
}

const features = [
  {
    title: "Auto card",
    body: "Every new issue and PR gets a ship-feed voting card with clear approve/reject instructions.",
  },
  {
    title: "/approve",
    body: "Approve an idea or merge a pull request with one comment.",
  },
  {
    title: "/reject",
    body: "Reject an idea to close the issue, or reject a PR to block it.",
  },
];

const steps = [
  "Install the GitHub App on your repositories.",
  "Open a new issue or pull request.",
  "The bot posts a voting card.",
  "Comment /approve or /reject to vote.",
];

const commands = [
  { cmd: "/approve", issue: "Adds approved label", pr: "Adds approved label and merges" },
  { cmd: "/reject", issue: "Adds rejected label and closes", pr: "Adds rejected label" },
];

export default function App() {
  const appQuery = createQuery(() => ({
    queryKey: ["app-info"],
    queryFn: fetchAppInfo,
  }));

  return (
    <div class="min-h-screen bg-slate-950 text-slate-50 font-sans antialiased">
      <main class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <section class="text-center sm:py-12">
          <img
            src="assets/bot-logo.png"
            alt="ship-feed bot logo"
            class="mx-auto w-28 h-28 sm:w-36 sm:h-36 rounded-2xl shadow-xl"
            width="144"
            height="144"
          />
          <h1 class="mt-8 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            ship-feed bot
          </h1>
          <p class="mt-4 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            Turn GitHub issues and pull requests into card-driven approve/reject
            decisions. Vote with a comment, let the bot do the rest.
          </p>
          <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/apps/wrikka-ship-bot"
              class="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-indigo-600 transition"
            >
              Install on GitHub
            </a>
            <a
              href="https://github.com/newkub/ship-feed-bot"
              class="inline-flex items-center justify-center rounded-xl bg-slate-800 px-6 py-3.5 text-base font-semibold text-white shadow hover:bg-slate-700 transition"
            >
              View source
            </a>
          </div>
        </section>

        <section class="mt-20 sm:mt-24">
          <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
            What it does
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={features}>
              {(item) => (
                <div class="rounded-2xl bg-slate-900 p-6 sm:p-8 shadow-lg border border-slate-800">
                  <h3 class="text-xl font-semibold text-white">{item.title}</h3>
                  <p class="mt-3 text-slate-400 leading-relaxed">{item.body}</p>
                </div>
              )}
            </For>
          </div>
        </section>

        <section class="mt-20 sm:mt-24">
          <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
            How to use
          </h2>
          <ol class="max-w-2xl mx-auto space-y-4">
            <For each={steps}>
              {(step, i) => (
                <li class="flex gap-4 items-start rounded-2xl bg-slate-900 p-4 sm:p-5 border border-slate-800">
                  <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
                    {i() + 1}
                  </span>
                  <span class="text-slate-300 pt-1">{step}</span>
                </li>
              )}
            </For>
          </ol>
        </section>

        <section class="mt-20 sm:mt-24">
          <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
            Commands
          </h2>
          <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow">
            <table class="w-full text-left text-sm sm:text-base">
              <thead class="bg-slate-800 text-slate-200">
                <tr>
                  <th class="px-4 sm:px-6 py-3 font-semibold">Command</th>
                  <th class="px-4 sm:px-6 py-3 font-semibold">On issue</th>
                  <th class="px-4 sm:px-6 py-3 font-semibold">On pull request</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 text-slate-300">
                <For each={commands}>
                  {(row) => (
                    <tr>
                      <td class="px-4 sm:px-6 py-4 font-mono font-medium text-white">
                        {row.cmd}
                      </td>
                      <td class="px-4 sm:px-6 py-4">{row.issue}</td>
                      <td class="px-4 sm:px-6 py-4">{row.pr}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </section>

        <section class="mt-20 sm:mt-24 rounded-2xl bg-slate-900 p-6 sm:p-8 border border-slate-800">
          <h2 class="text-2xl font-bold mb-4">App status</h2>
          <Show when={appQuery.isLoading}>
            <p class="text-slate-400">Loading app info...</p>
          </Show>
          <Show when={appQuery.isError}>
            <p class="text-red-400">Could not load app info from GitHub.</p>
          </Show>
          <Show when={!appQuery.isLoading && !appQuery.isError}>
            <p class="text-slate-300">
              <a
                href={appQuery.data?.html_url}
                class="text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {appQuery.data?.name}
              </a>
              <br />
              <span class="text-slate-400">
                {appQuery.data?.description || "No description set yet."}
              </span>
            </p>
          </Show>
        </section>

        <footer class="mt-20 sm:mt-24 text-center text-slate-500 text-sm">
          <p>
            Built for the ship-feed card-driven workflow. Open source on{" "}
            <a
              href="https://github.com/newkub/ship-feed-bot"
              class="text-indigo-400 hover:text-indigo-300"
            >
              GitHub
            </a>
            .
          </p>
        </footer>
      </main>
    </div>
  );
}
