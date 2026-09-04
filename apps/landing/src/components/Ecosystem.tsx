import { For } from "solid-js";
import {
  Brain,
  Database,
  Eye,
  MessageSquare,
  Monitor,
  Rocket,
  ShieldCheck,
  Smartphone,
  Zap,
} from "lucide-solid";
import SectionHeader from "./SectionHeader";
import VisualBlock from "./VisualBlock";

const parts = [
  { title: "GitHub bot", desc: "Comments voting cards on every issue and PR.", icon: MessageSquare, color: "indigo" },
  { title: "Mobile PWA", desc: "Swipe approve or reject like TikTok.", icon: Smartphone, color: "emerald" },
  { title: "Web dashboard", desc: "Inspect repos, cards, billing, and settings.", icon: Monitor, color: "orange" },
  { title: "Evidence vault", desc: "Images, logs, and CI links stored with hashes.", icon: Database, color: "purple" },
  { title: "Test oracle", desc: "Image and diff baselines for regression checks.", icon: Eye, color: "cyan" },
  { title: "Learning loop", desc: "Updates weights from every approve or reject.", icon: Brain, color: "pink" },
];

const colors: Record<string, string> = {
  indigo: "border-indigo-500/30 text-indigo-300 from-indigo-500/20 to-indigo-500/5",
  emerald: "border-emerald-500/30 text-emerald-300 from-emerald-500/20 to-emerald-500/5",
  orange: "border-orange-500/30 text-orange-300 from-orange-500/20 to-orange-500/5",
  purple: "border-purple-500/30 text-purple-300 from-purple-500/20 to-purple-500/5",
  cyan: "border-cyan-500/30 text-cyan-300 from-cyan-500/20 to-cyan-500/5",
  pink: "border-pink-500/30 text-pink-300 from-pink-500/20 to-pink-500/5",
};

export default function Ecosystem() {
  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/6 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="Ecosystem"
          subtitle="ship-feed is more than a bot. It is a full-stack loop that connects GitHub, Cloudflare, web, mobile, and agents."
        />

        <div class="max-w-2xl mx-auto mb-12">
          <VisualBlock variant="ecosystem" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min grid-flow-dense">
          <For each={parts}>
            {(part, i) => {
              const Icon = part.icon;
              const wide = i() === 0 || i() === 3 || i() === 4;
              return (
                <div
                  class={`rounded-2xl bg-zinc-900/60 p-6 border border-zinc-800 hover:border-indigo-500/30 hover:-translate-y-1 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-indigo-500/5 transition duration-300 group ${
                    wide ? "sm:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  <div
                    class={`flex h-12 w-12 items-center justify-center rounded-2xl mb-4 border bg-gradient-to-br ${colors[part.color]} group-hover:scale-110 transition duration-300`}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 class="text-lg font-semibold text-white mb-1 group-hover:text-indigo-300 transition">{part.title}</h3>
                  <p class="text-zinc-400 text-sm leading-relaxed">{part.desc}</p>
                </div>
              );
            }}
          </For>
        </div>

        <div class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="flex-1 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/60 p-8 sm:p-12 hover:border-indigo-500/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/5 transition duration-300 group">
            <div class="flex items-center gap-4 mb-6">
              <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 text-indigo-300 border border-indigo-500/30 group-hover:scale-110 transition duration-300">
                <Rocket size={28} />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">Continuous ship loop</h3>
                <p class="text-zinc-400">Implement → test → evidence → deploy</p>
              </div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <For each={["Implement", "Test", "Evidence", "Deploy"]}>
                {(label) => (
                  <div class="rounded-xl bg-zinc-950/50 border border-zinc-800 p-4 text-center hover:border-indigo-500/30 hover:bg-zinc-900/50 transition duration-300 group/inner">
                    <Zap size={20} class="mx-auto text-indigo-400 mb-2 group-hover/inner:scale-110 transition" />
                    <p class="text-sm font-medium text-zinc-200">{label}</p>
                  </div>
                )}
              </For>
            </div>
          </div>

          <div class="flex-1 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-8 sm:p-12 hover:-translate-y-1 hover:from-indigo-500/15 hover:to-purple-500/15 transition duration-300 group">
            <div class="flex items-center gap-4 mb-6">
              <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-300 border border-purple-500/30 group-hover:scale-110 transition duration-300">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">Approval-first</h3>
                <p class="text-zinc-400">Humans vote. Agents execute.</p>
              </div>
            </div>
            <p class="text-zinc-300 leading-relaxed">
              Nothing ships without a card. Every implementation, merge, and release is
              gated by a human approve or reject, with evidence attached.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
