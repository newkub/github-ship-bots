import { For } from "solid-js";
import {
  Activity,
  Check,
  Clock,
  GitBranch,
  GitPullRequest,
  Globe,
  LayoutDashboard,
  Package,
  Plus,
  Rocket,
  Search,
  Server,
  Settings,
  Shield,
  Sparkles,
  X,
} from "lucide-solid";
import SectionHeader from "./SectionHeader";
import { dashboardUrl } from "../data";

interface PreviewCard {
  id: string;
  title: string;
  repo: string;
  kind: "idea" | "work" | "merge" | "release";
  status: "pending" | "approved" | "rejected" | "shipped";
  score: number;
  impact: "high" | "medium" | "low";
  risk: "high" | "medium" | "low";
}

const cards: PreviewCard[] = [
  {
    id: "1",
    title: "Dark mode toggle",
    repo: "github-ship-bots",
    kind: "idea",
    status: "pending",
    score: 8.4,
    impact: "medium",
    risk: "low",
  },
  {
    id: "2",
    title: "Refactor auth flow",
    repo: "devin-skills",
    kind: "work",
    status: "approved",
    score: 9.1,
    impact: "high",
    risk: "medium",
  },
  {
    id: "3",
    title: "Update landing copy",
    repo: "github-ship-bots",
    kind: "merge",
    status: "rejected",
    score: 4.2,
    impact: "low",
    risk: "low",
  },
  {
    id: "4",
    title: "Ship v1.2.0",
    repo: "github-ship-bots",
    kind: "release",
    status: "shipped",
    score: 8.7,
    impact: "high",
    risk: "low",
  },
  {
    id: "5",
    title: "Mobile PWA icons",
    repo: "ship-feed-mobile",
    kind: "work",
    status: "pending",
    score: 7.3,
    impact: "medium",
    risk: "low",
  },
];

const statusMeta: Record<
  PreviewCard["status"],
  { label: string; dot: string; class: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-amber-400",
    class: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  approved: {
    label: "Approved",
    dot: "bg-emerald-400",
    class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  rejected: {
    label: "Rejected",
    dot: "bg-rose-400",
    class: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  shipped: {
    label: "Shipped",
    dot: "bg-indigo-400",
    class: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
};

const kindMeta: Record<
  PreviewCard["kind"],
  { label: string; icon: typeof Sparkles; class: string }
> = {
  idea: { label: "Idea", icon: Sparkles, class: "bg-indigo-500/15 text-indigo-400" },
  work: { label: "Work", icon: Rocket, class: "bg-emerald-500/15 text-emerald-400" },
  merge: { label: "Merge", icon: GitPullRequest, class: "bg-orange-500/15 text-orange-400" },
  release: { label: "Release", icon: Package, class: "bg-purple-500/15 text-purple-400" },
};

const impactPalette: Record<string, string> = {
  high: "bg-rose-500/10 text-rose-400",
  medium: "bg-amber-500/10 text-amber-400",
  low: "bg-emerald-500/10 text-emerald-400",
};

const riskPalette: Record<string, string> = {
  high: "bg-rose-500/10 text-rose-400",
  medium: "bg-amber-500/10 text-amber-400",
  low: "bg-emerald-500/10 text-emerald-400",
};

const columns: {
  status: PreviewCard["status"];
  label: string;
  icon: typeof Clock;
}[] = [
  { status: "pending", label: "Pending", icon: Clock },
  { status: "approved", label: "Approved", icon: Check },
  { status: "rejected", label: "Rejected", icon: X },
  { status: "shipped", label: "Shipped", icon: Package },
];

const stats = [
  { label: "Active cards", value: "24", icon: LayoutDashboard, class: "bg-indigo-500/15 text-indigo-400" },
  { label: "Pending review", value: "7", icon: Clock, class: "bg-amber-500/15 text-amber-400" },
  { label: "Shipped today", value: "12", icon: Package, class: "bg-emerald-500/15 text-emerald-400" },
  { label: "Avg. score", value: "8.4", icon: Activity, class: "bg-purple-500/15 text-purple-400" },
];

function ScoreRing(props: { score: number; size?: number }) {
  const size = props.size ?? 32;
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, props.score / 10));
  const dash = `${pct * circumference} ${circumference}`;
  const color = props.score >= 8 ? "#10b981" : props.score >= 5 ? "#f59e0b" : "#f43f5e";

  return (
    <div class="relative flex-shrink-0" style={{ width: `${size}px`, height: `${size}px` }}>
      <svg width={size} height={size} class="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#3f3f46"
          stroke-width={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          stroke-width={stroke}
          stroke-dasharray={dash}
          stroke-linecap="round"
        />
      </svg>
      <span class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
        {props.score.toFixed(1)}
      </span>
    </div>
  );
}

function MiniCard(props: { card: PreviewCard }) {
  const meta = kindMeta[props.card.kind];
  const Icon = meta.icon;
  const status = statusMeta[props.card.status];
  return (
    <div class="rounded-xl bg-zinc-950 border border-zinc-800 p-3 hover:border-indigo-500/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 transition duration-300 group">
      <div class="flex items-start justify-between gap-2 mb-2">
        <div class="flex items-center gap-2 min-w-0">
          <div class={`h-8 w-8 rounded-lg flex items-center justify-center ${meta.class}`}>
            <Icon size={16} />
          </div>
          <div class="min-w-0">
            <div class="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
              {meta.label}
            </div>
            <div class="text-xs text-zinc-500 truncate">{props.card.repo}</div>
          </div>
        </div>
        <ScoreRing score={props.card.score} size={28} />
      </div>

      <h4 class="text-sm font-semibold text-white mb-1.5 truncate">
        {props.card.title}
      </h4>

      <div class="flex flex-wrap items-center gap-1.5 mb-2.5">
        <span class={`text-[10px] font-medium px-1.5 py-0.5 rounded ${impactPalette[props.card.impact]}`}>
          Impact {props.card.impact}
        </span>
        <span class={`text-[10px] font-medium px-1.5 py-0.5 rounded ${riskPalette[props.card.risk]}`}>
          Risk {props.card.risk}
        </span>
      </div>

      <span
        class={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full border ${status.class}`}
      >
        <span class={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
        {status.label}
      </span>
    </div>
  );
}

export default function DashboardPreview() {
  return (
    <section class="py-20 sm:py-28 bg-zinc-950 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent" />
      <div class="absolute inset-0 hero-grid opacity-40" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="A dashboard that ships for you"
          subtitle="Approve, reject, and track every card from one place. The bot keeps the queue moving while you stay in control."
          align="center"
        >
          <a
            href={dashboardUrl}
            class="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition"
          >
            <LayoutDashboard size={18} />
            Explore the dashboard
          </a>
        </SectionHeader>

        <div class="relative max-w-6xl mx-auto">
          <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-30" />
          <div class="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50">
            <div class="flex items-center gap-3 px-4 py-3 bg-zinc-950 border-b border-zinc-800">
              <div class="flex items-center gap-1.5">
                <div class="h-3 w-3 rounded-full bg-rose-500" />
                <div class="h-3 w-3 rounded-full bg-amber-500" />
                <div class="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <div class="ml-4 flex-1 max-w-md rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-zinc-500 flex items-center gap-2 border border-zinc-800">
                <Globe size={12} />
                <span class="truncate">ship-feed.newkubise.workers.dev/dashboard</span>
              </div>
            </div>

            <div class="p-4 sm:p-6 bg-zinc-950 min-h-[28rem]">
              <div class="grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-6">
                <div class="hidden lg:flex flex-col gap-2 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 h-fit">
                  <div class="flex items-center gap-2 px-2 py-2 mb-2">
                    <div class="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                      <Rocket size={18} />
                    </div>
                    <span class="font-bold text-white">ship-feed</span>
                  </div>
                  <For each={[
                    { label: "Dashboard", icon: LayoutDashboard, active: true },
                    { label: "Cards", icon: GitPullRequest, active: false },
                    { label: "Repositories", icon: GitBranch, active: false },
                    { label: "Settings", icon: Settings, active: false },
                  ]}>
                    {(item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          class={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                            item.active
                              ? "bg-indigo-500/10 text-indigo-400"
                              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                          }`}
                        >
                          <Icon size={16} />
                          {item.label}
                        </div>
                      );
                    }}
                  </For>
                  <div class="mt-auto pt-4 border-t border-zinc-800">
                    <div class="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400">
                      <Shield size={16} class="text-emerald-400" />
                      Guardrails on
                    </div>
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 class="text-xl font-bold text-white flex items-center gap-2">
                        <LayoutDashboard size={20} class="text-indigo-400" />
                        Dashboard
                      </h3>
                      <p class="text-xs text-zinc-500 mt-0.5">Realtime view of your ship pipeline</p>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-400">
                        <Search size={14} />
                        <span class="text-xs">Search cards...</span>
                      </div>
                      <button class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-600 transition">
                        <Plus size={14} />
                        New idea
                      </button>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    <For each={stats}>
                      {(stat) => {
                        const Icon = stat.icon;
                        return (
                          <div class="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 flex items-center gap-3 hover:border-indigo-500/30 hover:-translate-y-0.5 transition duration-300">
                            <div class={`h-10 w-10 rounded-xl flex items-center justify-center ${stat.class}`}>
                              <Icon size={20} />
                            </div>
                            <div>
                              <div class="text-xl font-bold text-white">{stat.value}</div>
                              <div class="text-xs text-zinc-400">{stat.label}</div>
                            </div>
                          </div>
                        );
                      }}
                    </For>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <For each={columns}>
                      {(col) => {
                        const Icon = col.icon;
                        const items = cards.filter((c) => c.status === col.status);
                        return (
                          <div class="flex flex-col rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-3 min-h-[12rem]">
                            <div class="flex items-center justify-between mb-3 px-1">
                              <div class="flex items-center gap-2">
                                <div class="h-7 w-7 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center">
                                  <Icon size={14} />
                                </div>
                                <span class="text-sm font-bold text-zinc-200">{col.label}</span>
                              </div>
                              <span class="text-xs font-semibold text-zinc-500 bg-zinc-950 border border-zinc-800 px-2 py-0.5 rounded-full">
                                {items.length}
                              </span>
                            </div>
                            <div class="flex-1 space-y-3">
                              <For each={items}>
                                {(card) => <MiniCard card={card} />}
                              </For>
                            </div>
                          </div>
                        );
                      }}
                    </For>
                  </div>

                  <div class="mt-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-4 flex items-center gap-3">
                    <Server size={18} class="text-emerald-400" />
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-white">Worker health</div>
                      <div class="text-xs text-zinc-500">All queues running · last heartbeat 2s ago</div>
                    </div>
                    <span class="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Healthy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
