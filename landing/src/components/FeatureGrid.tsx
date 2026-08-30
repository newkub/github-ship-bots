import { CheckCircle2, MessageSquare, XCircle } from "lucide-solid";
import GitHubCard from "./GitHubCard";

export default function FeatureGrid() {
  return (
    <section class="py-24 sm:py-32">
      <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">
        What it does
      </h2>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="rounded-2xl bg-zinc-900/70 p-6 sm:p-8 border border-zinc-800 hover:border-orange-500/50 transition">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 mb-5">
            <MessageSquare size={24} />
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">Auto card</h3>
          <p class="text-zinc-400 leading-relaxed mb-6">
            Every new issue and PR gets a clear voting card.
          </p>
          <GitHubCard
            title="Dark mode toggle"
            type="issue"
            state="open"
            number={12}
            labels={[{ text: "ship-feed", color: "zinc" }]}
            botReply="Reply with /approve or /reject to vote."
          />
        </div>

        <div class="rounded-2xl bg-zinc-900/70 p-6 sm:p-8 border border-zinc-800 hover:border-emerald-500/50 transition">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-5">
            <CheckCircle2 size={24} />
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">/approve</h3>
          <p class="text-zinc-400 leading-relaxed mb-6">
            Approve and merge with a single comment.
          </p>
          <GitHubCard
            title="Add login page"
            type="pull-request"
            state="merged"
            number={8}
            labels={[
              { text: "approved", color: "emerald" },
              { text: "ship-feed", color: "zinc" },
            ]}
            comment="/approve"
            botReply="Merged by ship-feed bot."
          />
        </div>

        <div class="rounded-2xl bg-zinc-900/70 p-6 sm:p-8 border border-zinc-800 hover:border-rose-500/50 transition">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 mb-5">
            <XCircle size={24} />
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">/reject</h3>
          <p class="text-zinc-400 leading-relaxed mb-6">
            Reject and close or block an idea.
          </p>
          <GitHubCard
            title="Rewrite in Perl"
            type="issue"
            state="closed"
            number={3}
            labels={[
              { text: "rejected", color: "rose" },
              { text: "ship-feed", color: "zinc" },
            ]}
            comment="/reject"
            botReply="Rejected and closed by ship-feed bot."
          />
        </div>
      </div>
    </section>
  );
}
