import type { Component } from "solid-js";
import {
  Bot,
  Brain,
  CheckCircle2,
  CreditCard,
  Eye,
  GitPullRequest,
  HelpCircle,
  Image,
  Layers,
  ListOrdered,
  MessageSquare,
  Monitor,
  Rocket,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Table2,
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

export const installUrl = import.meta.env.VITE_GITHUB_APP_INSTALL_URL || "https://github.com/apps/wrikka-ship-bot";

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
    title: "GitHub App",
    body: "Watches issues and pull requests, then turns them into scored cards automatically.",
    icon: GitPullRequest,
  },
  {
    title: "Vote with comments",
    body: "Comment /approve, /reject, or /ship directly on GitHub. No context switching.",
    icon: MessageSquare,
  },
  {
    title: "Web dashboard",
    body: "Filter, inspect, and manage the queue from a SolidJS dashboard with real data.",
    icon: Monitor,
  },
  {
    title: "Mobile PWA",
    body: "Swipe through cards like a feed, even when offline. Queue flushes when you're back.",
    icon: Smartphone,
  },
  {
    title: "Evidence & oracle",
    body: "Attach screenshots, logs, and videos. Compare UI against baselines to catch regressions.",
    icon: Image,
  },
  {
    title: "Stripe billing",
    body: "Checkout, subscriptions, and pro plan upgrades built in.",
    icon: CreditCard,
  },
  {
    title: "WorkOS auth",
    body: "Secure GitHub OAuth login with session-backed state and rate limiting.",
    icon: ShieldCheck,
  },
  {
    title: "Ship loop",
    body: "A continuous orchestrator checks approved cards, verifies mergeability, and ships.",
    icon: Rocket,
  },
];

export const steps: Step[] = [
  {
    title: "Install the GitHub App",
    desc: "Grant access to the repos you want to ship. The bot starts listening immediately.",
    icon: GitPullRequest,
  },
  {
    title: "Open an issue or PR",
    desc: "Every new idea or pull request becomes a scored card with impact, risk, and evidence.",
    icon: Sparkles,
  },
  {
    title: "Vote your way",
    desc: "Approve, reject, or ship from the dashboard, mobile PWA, or a GitHub comment.",
    icon: ThumbsUp,
  },
  {
    title: "Bot ships it",
    desc: "The orchestrator verifies mergeability, runs checks, and ships approved cards.",
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
  const baseUrl = import.meta.env.VITE_GITHUB_API_URL || "https://api.github.com";
  const appName = import.meta.env.VITE_GITHUB_APP_NAME || "wrikka-ship-bot";
  const res = await fetch(`${baseUrl}/apps/${appName}`);
  if (!res.ok) throw new Error("Failed to load app info");
  return res.json();
}
