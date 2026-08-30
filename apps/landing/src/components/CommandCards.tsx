import { ArrowRight, CheckCircle2, XCircle } from "lucide-solid";
import GitHubCard from "./GitHubCard";

export default function CommandCards() {
  return (
    <section class="py-24 sm:py-32">
      <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4">
        Commands
      </h2>
      <p class="text-center text-zinc-400 mb-12 max-w-2xl mx-auto">
        Vote by commenting. The bot reads the command and takes action.
      </p>

      <div class="space-y-8">
        <div class="rounded-2xl bg-zinc-900/70 p-6 sm:p-8 border border-zinc-800 hover:border-emerald-500/30 transition">
          <div class="flex items-center gap-3 mb-6">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
            <code class="text-2xl font-bold text-white font-mono">/approve</code>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <GitHubCard
              title="Add dark mode"
              type="pull-request"
              state="open"
              number={42}
              labels={[{ text: "ship-feed", color: "zinc" }]}
              comment="/approve"
            />
            <div class="flex justify-center">
              <ArrowRight size={28} class="text-zinc-600" />
            </div>
            <GitHubCard
              title="Add dark mode"
              type="pull-request"
              state="merged"
              number={42}
              labels={[
                { text: "approved", color: "emerald" },
                { text: "ship-feed", color: "zinc" },
              ]}
              botReply="Merged by github-ship-bots."
            />
          </div>
        </div>

        <div class="rounded-2xl bg-zinc-900/70 p-6 sm:p-8 border border-zinc-800 hover:border-rose-500/30 transition">
          <div class="flex items-center gap-3 mb-6">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
              <XCircle size={24} />
            </div>
            <code class="text-2xl font-bold text-white font-mono">/reject</code>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <GitHubCard
              title="Switch to Ruby"
              type="issue"
              state="open"
              number={7}
              labels={[{ text: "ship-feed", color: "zinc" }]}
              comment="/reject"
            />
            <div class="flex justify-center">
              <ArrowRight size={28} class="text-zinc-600" />
            </div>
            <GitHubCard
              title="Switch to Ruby"
              type="issue"
              state="closed"
              number={7}
              labels={[
                { text: "rejected", color: "rose" },
                { text: "ship-feed", color: "zinc" },
              ]}
              botReply="Rejected and closed by github-ship-bots."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
