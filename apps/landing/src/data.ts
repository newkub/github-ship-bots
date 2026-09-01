import type { Component } from "solid-js";
import {
  Bot,
  CheckCircle2,
  Download,
  GitPullRequest,
  HelpCircle,
  Layers,
  ListOrdered,
  MessageSquare,
  MousePointerClick,
  Rocket,
  Settings,
  Sparkles,
  Terminal,
  XCircle,
  Zap,
} from "lucide-solid";

export interface Feature {
  title: string;
  body: string;
  icon: Component<{ size?: number; class?: string }>;
}

export interface Step {
  text: string;
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

export const sections: Section[] = [
  { id: "home", label: "Home", icon: Sparkles },
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
    title: "Card-driven ideas",
    body: "Every issue and PR becomes a ship card with impact, risk, and effect scores that humans can approve or reject.",
    icon: Layers,
  },
  {
    title: "Autonomous implementation",
    body: "Approved cards are picked up by agent workflows that implement, test, gather evidence, and ship.",
    icon: Bot,
  },
  {
    title: "/approve or /reject",
    body: "Vote with a single comment. The bot updates labels, merges, closes, or blocks based on your decision.",
    icon: CheckCircle2,
  },
  {
    title: "Evidence vault",
    body: "Every ship produces traceable evidence, baselines, and oracle results so you can audit and learn.",
    icon: MessageSquare,
  },
  {
    title: "Web & mobile dashboards",
    body: "Swipe cards on the PWA, customize plans and repos on the web dashboard, and inspect live pages.",
    icon: MousePointerClick,
  },
  {
    title: "Continuous learning",
    body: "The system updates learning weights from every outcome, improving future ideas and risk scoring.",
    icon: Settings,
  },
];

export const steps: Step[] = [
  { text: "Install the GitHub App and connect your repositories.", icon: Download },
  { text: "Open an idea, pull request, or release proposal.", icon: GitPullRequest },
  { text: "ship-feed turns it into a scored card on web and mobile.", icon: Layers },
  { text: "Comment /approve or /reject to move it forward.", icon: MousePointerClick },
  { text: "The orchestrator implements, verifies, ships, and learns.", icon: Rocket },
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
