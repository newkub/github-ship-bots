import { Activity, Check, Clock, GitPullRequest, LayoutDashboard, Package, Rocket, Sparkles, X } from "lucide-solid";

export interface PreviewCard {
  id: string;
  title: string;
  repo: string;
  kind: "idea" | "work" | "merge" | "release";
  status: "pending" | "approved" | "rejected" | "shipped";
  score: number;
  impact: "high" | "medium" | "low";
  risk: "high" | "medium" | "low";
}

export const previewCards: PreviewCard[] = [
  { id: "1", title: "Dark mode toggle", repo: "github-ship-bots", kind: "idea", status: "pending", score: 8.4, impact: "medium", risk: "low" },
  { id: "2", title: "Refactor auth flow", repo: "devin-skills", kind: "work", status: "approved", score: 9.1, impact: "high", risk: "medium" },
  { id: "3", title: "Update landing copy", repo: "github-ship-bots", kind: "merge", status: "rejected", score: 4.2, impact: "low", risk: "low" },
  { id: "4", title: "Ship v1.2.0", repo: "github-ship-bots", kind: "release", status: "shipped", score: 8.7, impact: "high", risk: "low" },
  { id: "5", title: "Mobile PWA icons", repo: "ship-feed-mobile", kind: "work", status: "pending", score: 7.3, impact: "medium", risk: "low" },
];

export const statusMeta: Record<PreviewCard["status"], { label: string; dot: string; class: string }> = {
  pending: { label: "Pending", dot: "bg-amber-400", class: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  approved: { label: "Approved", dot: "bg-emerald-400", class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  rejected: { label: "Rejected", dot: "bg-rose-400", class: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
  shipped: { label: "Shipped", dot: "bg-indigo-400", class: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
};

export const kindMeta: Record<PreviewCard["kind"], { label: string; icon: typeof Sparkles; class: string }> = {
  idea: { label: "Idea", icon: Sparkles, class: "bg-indigo-500/15 text-indigo-400" },
  work: { label: "Work", icon: Rocket, class: "bg-emerald-500/15 text-emerald-400" },
  merge: { label: "Merge", icon: GitPullRequest, class: "bg-orange-500/15 text-orange-400" },
  release: { label: "Release", icon: Package, class: "bg-purple-500/15 text-purple-400" },
};

export const impactPalette: Record<string, string> = {
  high: "bg-rose-500/10 text-rose-400",
  medium: "bg-amber-500/10 text-amber-400",
  low: "bg-emerald-500/10 text-emerald-400",
};

export const riskPalette: Record<string, string> = {
  high: "bg-rose-500/10 text-rose-400",
  medium: "bg-amber-500/10 text-amber-400",
  low: "bg-emerald-500/10 text-emerald-400",
};

export const columns: { status: PreviewCard["status"]; label: string; icon: typeof Clock }[] = [
  { status: "pending", label: "Pending", icon: Clock },
  { status: "approved", label: "Approved", icon: Check },
  { status: "rejected", label: "Rejected", icon: X },
  { status: "shipped", label: "Shipped", icon: Package },
];

export const stats = [
  { label: "Active cards", value: "24", icon: LayoutDashboard, class: "bg-indigo-500/15 text-indigo-400" },
  { label: "Pending review", value: "7", icon: Clock, class: "bg-amber-500/15 text-amber-400" },
  { label: "Shipped today", value: "12", icon: Package, class: "bg-emerald-500/15 text-emerald-400" },
  { label: "Avg. score", value: "8.4", icon: Activity, class: "bg-purple-500/15 text-purple-400" },
];
