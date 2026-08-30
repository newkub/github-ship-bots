import { Bot } from "lucide-solid";

export default function About() {
  return (
    <section class="py-24 sm:py-32">
      <div class="rounded-2xl bg-zinc-900/70 p-6 sm:p-10 border border-zinc-800">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
            <Bot size={20} />
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold">What is ship-feed bot?</h2>
        </div>
        <p class="text-zinc-300 leading-relaxed">
          It is a GitHub App that brings a card-driven approve/reject workflow to
          your repositories. When someone opens an issue or a pull request, the
          bot posts a voting card. Team members reply with{" "}
          <code class="bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-orange-400">
            /approve
          </code>{" "}
          or{" "}
          <code class="bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-rose-400">
            /reject
          </code>
          . Approved PRs are merged, rejected issues are closed, and every
          decision is labeled automatically.
        </p>
      </div>
    </section>
  );
}
