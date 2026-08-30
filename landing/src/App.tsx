import { createQuery } from "@tanstack/solid-query";

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

function App() {
  const appQuery = createQuery(() => ({
    queryKey: ["app-info"],
    queryFn: fetchAppInfo,
  }));

  return (
    <div class="max-w-3xl mx-auto p-6 md:p-10 font-sans bg-slate-900 text-slate-50 min-h-screen">
      <header class="text-center py-10">
        <img
          src="assets/bot-logo.png"
          alt="ship-feed bot logo"
          class="rounded-xl mx-auto w-32 h-32"
          width="128"
          height="128"
        />
        <h1 class="text-4xl md:text-5xl font-bold mt-4">ship-feed bot</h1>
        <p class="text-slate-400 text-lg md:text-xl mt-2">
          Turn GitHub issues and pull requests into card-driven approve/reject
          decisions.
        </p>
        <div class="flex flex-col md:flex-row gap-4 justify-center mt-8">
          <a
            href="https://github.com/apps/wrikka-ship-bot"
            class="inline-block px-6 py-3 rounded-lg font-semibold bg-indigo-500 hover:bg-indigo-600 text-white no-underline"
          >
            Install on GitHub
          </a>
          <a
            href="https://github.com/newkub/ship-feed-bot"
            class="inline-block px-6 py-3 rounded-lg font-semibold bg-slate-700 hover:bg-slate-600 text-white no-underline"
          >
            View source
          </a>
        </div>
      </header>

      <section class="my-10 p-6 rounded-xl bg-slate-800">
        <h2 class="text-2xl font-semibold mb-4">How it works</h2>
        <ol class="list-decimal pl-5 space-y-2 text-slate-300">
          <li>
            <strong>Open a new issue or PR</strong> in a repository where the
            bot is installed.
          </li>
          <li>
            <strong>The bot posts a card</strong> with the title, status, and
            voting instructions.
          </li>
          <li>
            <strong>Reply with</strong> <code>/approve</code> or{" "}
            <code>/reject</code>.
          </li>
          <li>
            The bot <strong>labels, comments, and acts</strong> on the decision
            (closes rejected issues, merges approved PRs).
          </li>
        </ol>
      </section>

      <section class="my-10 p-6 rounded-xl bg-slate-800">
        <h2 class="text-2xl font-semibold mb-4">Commands</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-lg bg-slate-900">
            <h3 class="font-semibold mb-2">
              <code>/approve</code>
            </h3>
            <p class="text-slate-400">
              Mark the card as approved. On a PR, the bot merges it.
            </p>
          </div>
          <div class="p-4 rounded-lg bg-slate-900">
            <h3 class="font-semibold mb-2">
              <code>/reject</code>
            </h3>
            <p class="text-slate-400">
              Mark the card as rejected. On an issue, the bot closes it.
            </p>
          </div>
        </div>
      </section>

      <section class="my-10 p-6 rounded-xl bg-slate-800">
        <h2 class="text-2xl font-semibold mb-4">App status</h2>
        <div class="text-slate-300">
          {appQuery.isLoading ? (
            <p>Loading app info...</p>
          ) : appQuery.isError ? (
            <p class="text-red-400">Could not load app info from GitHub.</p>
          ) : (
            <p>
              <a href={appQuery.data?.html_url} class="text-sky-400">
                {appQuery.data?.name}
              </a>
              <br />
              {appQuery.data?.description || "No description yet."}
            </p>
          )}
        </div>
      </section>

      <section class="my-10 p-6 rounded-xl bg-slate-800">
        <h2 class="text-2xl font-semibold mb-4">Install</h2>
        <ol class="list-decimal pl-5 space-y-2 text-slate-300">
          <li>Click Install on GitHub.</li>
          <li>Choose the repositories the bot can access.</li>
          <li>Start opening issues or PRs.</li>
        </ol>
      </section>

      <footer class="text-center text-slate-500 py-8">
        <p>
          Built for the ship-feed card-driven workflow. Open source on{" "}
          <a href="https://github.com/newkub/ship-feed-bot" class="text-sky-400">
            GitHub
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

export default App;
