export interface Feature {
  title: string;
  body: string;
}

export interface Step {
  text: string;
}

export interface Command {
  cmd: string;
  issue: string;
  pr: string;
}

export const features: Feature[] = [
  {
    title: "Auto card",
    body: "Every new issue and pull request gets a clear voting card so your team can decide quickly.",
  },
  {
    title: "/approve",
    body: "Approve an idea or merge a pull request with a single comment.",
  },
  {
    title: "/reject",
    body: "Reject an issue to close it, or reject a PR to block it.",
  },
];

export const steps: Step[] = [
  { text: "Install the GitHub App on your repositories." },
  { text: "Open a new issue or pull request." },
  { text: "The bot posts a ship-feed voting card." },
  { text: "Comment /approve or /reject to vote." },
  { text: "The bot updates labels and runs the chosen action." },
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
