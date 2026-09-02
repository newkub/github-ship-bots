import type { Component } from "solid-js";
import {
  Bot,
  Brain,
  CheckCircle2,
  Eye,
  GitPullRequest,
  HelpCircle,
  Layers,
  ListOrdered,
  MessageSquare,
  Rocket,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  ThumbsUp,
  XCircle,
  Zap,
} from "lucide-solid";

export interface Feature {
  title: string;
  body: string;
  icon: Component<{ size?: number; class?: string }>;
}

export interface Step {
  title: string;
  desc: string;
  icon: Component<{ size?: number; class?: string }>;
}

export interface Command {
  cmd: string;
  issue: string;
  pr: string;
}

export interface Section {
  id: string;
  label: string;
  icon: Component<{ size?: number; class?: string }>;
}

export const appName = "ship-feed";

export const appSlug = "github-ship-bots";

export const dashboardUrl = "/dashboard/";

export const installUrl = "https://github.com/apps/wrikka-ship-bot";

export const sections: Section[] = [
  { id: "home", label: "Home", icon: Sparkles },
  { id: "preview", label: "Preview", icon: Eye },
  { id: "about", label: "What is it?", icon: HelpCircle },
  { id: "pipeline", label: "Pipeline", icon: GitPullRequest },
  { id: "features", label: "What it does", icon: Zap },
  { id: "ecosystem", label: "Ecosystem", icon: Layers },
  { id: "how-it-works", label: "How it works", icon: ListOrdered },
  { id: "demo", label: "Demo", icon: Terminal },
  { id: "commands", label: "Commands", icon: MessageSquare },
  { id: "install", label: "Install", icon: Rocket },
];

export const features: Feature[] = [
  {
    title: "Fast",
    body: "From idea to open PR in minutes, not days.",
    icon: Zap,
  },
  {
    title: "Smart",
    body: "AI scores impact, risk, and evidence before you vote.",
    icon: Brain,
  },
  {
    title: "Auto",
    body: "One approval and the bot writes, tests, and ships.",
    icon: Bot,
  },
  {
    title: "Safe",
    body: "Guardrails, audit trails, and rollbacks by default.",
    icon: ShieldCheck,
  },
];

export const steps: Step[] = [
  {
    title: "Connect repo",
    desc: "Install the GitHub App and pick the repositories to ship.",
    icon: GitPullRequest,
  },
  {
    title: "Set rules",
    desc: "Define impact thresholds, review policies, and guardrails.",
    icon: SlidersHorizontal,
  },
  {
    title: "Swipe/approve",
    desc: "Review scored cards and approve with a swipe or comment.",
    icon: ThumbsUp,
  },
  {
    title: "Auto ship",
    desc: "The bot implements, verifies, and ships continuously.",
    icon: Rocket,
  },
];

export const commands: Command[] = [
  { cmd: "/approve", issue: "Labels approved and queues implementation", pr: "Labels approved and merges when safe" },
  { cmd: "/reject", issue: "Labels rejected and closes the idea", pr: "Labels rejected and blocks merge" },
  { cmd: "/ship", issue: "N/A", pr: "Triggers the full verify → ship → deploy pipeline" },
];

export interface AppInfo {
  name: string;
  html_url: string;
  description: string | null;
}

export async function fetchAppInfo(): Promise<AppInfo> {
  const res = await fetch("https://api.github.com/apps/wrikka-ship-bot");
  if (!res.ok) throw new Error("Failed to load app info");
  return res.json();
}
