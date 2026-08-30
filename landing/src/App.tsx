import { createQuery } from "@tanstack/solid-query";
import "./index.css";

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
    <div class="app">
      <header class="hero">
        <img
          src="/assets/bot-logo.png"
          alt="ship-feed bot logo"
          class="hero-logo"
          width="128"
          height="128"
        />
        <h1>ship-feed bot</h1>
        <p class="hero-lead">
          Turn GitHub issues and pull requests into card-driven
          approve/reject decisions.
        </p>
        <div class="hero-cta">
          <a
            href="https://github.com/apps/wrikka-ship-bot"
            class="button primary"
          >
            Install on GitHub
          </a>
          <a
            href="https://github.com/newkub/ship-feed-bot"
            class="button secondary"
          >
            View source
          </a>
        </div>
      </header>

      <section class="section">
        <h2>How it works</h2>
        <ol class="steps">
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

      <section class="section alt">
        <h2>Commands</h2>
        <div class="cards">
          <div class="card">
            <h3>
              <code>/approve</code>
            </h3>
            <p>Mark the card as approved. On a PR, the bot merges it.</p>
          </div>
          <div class="card">
            <h3>
              <code>/reject</code>
            </h3>
            <p>Mark the card as rejected. On an issue, the bot closes it.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <h2>App status</h2>
        <div class="status">
          {appQuery.isLoading ? (
            <p>Loading app info...</p>
          ) : appQuery.isError ? (
            <p class="error">Could not load app info from GitHub.</p>
          ) : (
            <p>
              <a href={appQuery.data?.html_url}>{appQuery.data?.name}</a>
              <br />
              {appQuery.data?.description || "No description yet."}
            </p>
          )}
        </div>
      </section>

      <section class="section alt">
        <h2>Install</h2>
        <ol class="steps">
          <li>Click Install on GitHub.</li>
          <li>Choose the repositories the bot can access.</li>
          <li>Start opening issues or PRs.</li>
        </ol>
      </section>

      <footer class="footer">
        <p>
          Built for the ship-feed card-driven workflow. Open source on{" "}
          <a href="https://github.com/newkub/ship-feed-bot">GitHub</a>.
        </p>
      </footer>
    </div>
  );
}

export default App;
