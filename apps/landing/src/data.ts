import type { Component } from "solid-js";
import {
  Bot,
  CheckCircle2,
  Download,
  GitPullRequest,
  HelpCircle,
  ListOrdered,
  MessageSquare,
  MousePointerClick,
  Rocket,
  Settings,
  Sparkles,
  XCircle,
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

export const sections: Section[] = [
  { id: "home", label: "Home", icon: Sparkles },
  { id: "about", label: "What is it?", icon: HelpCircle },
  { id: "features", label: "What it does", icon: Bot },
  { id: "how-it-works", label: "How to use", icon: ListOrdered },
  { id: "commands", label: "Commands", icon: MessageSquare },
  { id: "install", label: "Install", icon: Rocket },
];

export const features: Feature[] = [
  {
    title: "Auto card",
    body: "Every new issue and pull request gets a clear voting card so your team can decide quickly.",
    icon: MessageSquare,
  },
  {
    title: "/approve",
    body: "Approve an idea or merge a pull request with a single comment.",
    icon: CheckCircle2,
  },
  {
    title: "/reject",
    body: "Reject an issue to close it, or reject a PR to block it.",
    icon: XCircle,
  },
];

export const steps: Step[] = [
  { text: "Install the GitHub App on your repositories.", icon: Download },
  { text: "Open a new issue or pull request.", icon: GitPullRequest },
  { text: "The bot posts a github-ship-bots voting card.", icon: MessageSquare },
  { text: "Comment /approve or /reject to vote.", icon: MousePointerClick },
  { text: "The bot updates labels and runs the chosen action.", icon: Settings },
];

export const commands: Command[] = [
  { cmd: "/approve", issue: "Adds approved label", pr: "Adds approved label and merges" },
  { cmd: "/reject", issue: "Adds rejected label and closes", pr: "Adds rejected label" },
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
