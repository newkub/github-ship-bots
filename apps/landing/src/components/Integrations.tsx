import { For } from "solid-js";
import { Cloud, CreditCard, GitPullRequest, ShieldCheck, Zap } from "lucide-solid";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

const integrations = [
  {
    name: "GitHub",
    role: "Issues, PRs, and webhooks",
    icon: GitPullRequest,
    color: "text-zinc-100 bg-zinc-900 border-zinc-700",
  },
  {
    name: "WorkOS",
    role: "OAuth and session auth",
    icon: ShieldCheck,
    color: "text-indigo-100 bg-indigo-950 border-indigo-800",
  },
  {
    name: "Stripe",
    role: "Billing and subscriptions",
    icon: CreditCard,
    color: "text-violet-100 bg-violet-950 border-violet-800",
  },
  {
    name: "Cloudflare",
    role: "Workers, D1, R2, and KV",
    icon: Cloud,
    color: "text-orange-100 bg-orange-950 border-orange-800",
  },
  {
    name: "Bun",
    role: "Runtime and package manager",
    icon: Zap,
    color: "text-amber-100 bg-amber-950 border-amber-800",
  },
];

export default function Integrations() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <ScrollReveal>
          <SectionHeader
            title="Built on the stack you already use"
            subtitle="ship-feed wires together GitHub, WorkOS, Stripe, and Cloudflare so you don't have to."
          />
        </ScrollReveal>

        <ScrollReveal selector=".integration-card" stagger={100}>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
            <For each={integrations}>
              {(item) => {
                const Icon = item.icon;
                return (
                  <div class="integration-card group relative rounded-2xl bg-zinc-900/60 border border-zinc-800 p-6 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-indigo-500/5 transition duration-300">
                    <div class={`flex h-12 w-12 items-center justify-center rounded-xl border mb-5 ${item.color} group-hover:scale-110 transition duration-300`}>
                      <Icon size={24} />
                    </div>
                    <h3 class="text-lg font-semibold text-white mb-1">
                      {item.name}
                    </h3>
                    <p class="text-sm text-zinc-400">{item.role}</p>
                  </div>
                );
              }}
            </For>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
