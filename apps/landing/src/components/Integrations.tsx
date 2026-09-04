import { For } from "solid-js";
import { Cloud, CreditCard, GitPullRequest, ShieldCheck, Zap } from "lucide-solid";
import SectionHeader from "./SectionHeader";

const integrations = [
  { name: "GitHub", role: "Issues, PRs, and webhooks", icon: GitPullRequest, color: "from-zinc-500/20 to-zinc-500/5 text-zinc-200 border-zinc-600" },
  { name: "WorkOS", role: "OAuth and session auth", icon: ShieldCheck, color: "from-indigo-500/20 to-indigo-500/5 text-indigo-200 border-indigo-600" },
  { name: "Stripe", role: "Billing and subscriptions", icon: CreditCard, color: "from-violet-500/20 to-violet-500/5 text-violet-200 border-violet-600" },
  { name: "Cloudflare", role: "Workers, D1, R2, and KV", icon: Cloud, color: "from-orange-500/20 to-orange-500/5 text-orange-200 border-orange-600" },
  { name: "Bun", role: "Runtime and package manager", icon: Zap, color: "from-amber-500/20 to-amber-500/5 text-amber-200 border-amber-600" },
];

export default function Integrations() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="Built on the stack you already use"
          subtitle="ship-feed wires together GitHub, WorkOS, Stripe, and Cloudflare so you don't have to."
        />

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
          <For each={integrations}>
            {(item) => {
              const Icon = item.icon;
              return (
                <div class="group relative rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 hover:border-indigo-500/30 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-indigo-500/5 transition overflow-hidden">
                  <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-tr-2xl rounded-bl-[4rem] opacity-0 group-hover:opacity-100 transition" />
                  <div class={`relative flex h-12 w-12 items-center justify-center rounded-2xl border mb-5 bg-gradient-to-br ${item.color} group-hover:scale-110 transition`}>
                    <Icon size={24} />
                  </div>
                  <h3 class="relative text-lg font-semibold text-white mb-1">{item.name}</h3>
                  <p class="relative text-sm text-zinc-400">{item.role}</p>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </section>
  );
}
