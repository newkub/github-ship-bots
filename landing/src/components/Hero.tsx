import { Bot, GitPullRequest, MessageSquare, ThumbsDown, ThumbsUp } from "lucide-solid";
import ExternalLink from "./ExternalLink";

export default function Hero() {
  return (
    <section class="min-h-screen flex items-center px-6 sm:px-8 lg:px-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-6xl mx-auto">
        <div class="text-center lg:text-left">
          <div class="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-400 mb-6">
            <Bot size={16} />
            <span>GitHub App</span>
          </div>
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
            github-ship-bots
          </h1>
          <p class="mt-6 text-lg sm:text-xl text-zinc-400 max-w-lg mx-auto lg:mx-0">
            Turn issues and pull requests into card-driven approve/reject
            decisions. Vote with a comment, let the bot ship it for you.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <ExternalLink
              href="https://github.com/apps/wrikka-ship-bot"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition"
            >
              Install on GitHub
            </ExternalLink>
            <ExternalLink
              href="https://github.com/newkub/github-ship-bots"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-800 px-6 py-3.5 text-base font-semibold text-white shadow hover:bg-zinc-700 transition"
            >
              View source
            </ExternalLink>
          </div>
        </div>

        <div class="relative flex justify-center items-center h-80 lg:h-auto">
          <div class="absolute inset-0 rounded-full bg-orange-500/10 blur-3xl" />
          <div class="relative w-72 h-72 sm:w-96 sm:h-96">
            <div class="absolute -top-4 -left-4 sm:top-0 sm:left-0 flex h-48 w-80 -rotate-3 rounded-2xl bg-zinc-900/90 p-5 shadow-xl border border-zinc-800">
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400">
                  <GitPullRequest size={20} />
                </div>
                <div class="flex-1">
                  <div class="h-3 w-32 rounded bg-zinc-700" />
                  <div class="mt-2 h-2 w-48 rounded bg-zinc-800" />
                  <div class="mt-4 flex gap-2">
                    <span class="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                      <ThumbsUp size={12} /> /approve
                    </span>
                    <span class="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-1 text-xs font-medium text-rose-400">
                      <ThumbsDown size={12} /> /reject
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="absolute bottom-8 right-0 sm:bottom-4 sm:right-4 flex h-48 w-80 rotate-3 rounded-2xl bg-zinc-900 p-5 shadow-2xl border border-orange-500/30">
              <div class="flex items-start gap-3">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                  <MessageSquare size={20} />
                </div>
                <div class="flex-1">
                  <div class="h-3 w-40 rounded bg-zinc-700" />
                  <div class="mt-2 h-2 w-56 rounded bg-zinc-800" />
                  <div class="mt-4 inline-flex items-center gap-1 rounded-md bg-orange-500/10 px-2 py-1 text-xs font-medium text-orange-400">
                    <Bot size={12} /> github-ship-bots
                  </div>
                </div>
              </div>
            </div>

            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-950 border-4 border-orange-500 shadow-2xl shadow-orange-500/30">
              <img
                src="assets/bot-logo.png"
                alt="github-ship-bots logo"
                class="h-16 w-16 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
