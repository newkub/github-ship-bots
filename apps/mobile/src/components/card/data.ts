import { Briefcase, GitMerge, Package, Rocket } from "lucide-solid";

export const kindIcons = {
  idea: Rocket,
  work: Briefcase,
  merge: GitMerge,
  release: Package,
};

export const kindLabels = {
  idea: "Idea",
  work: "Work",
  merge: "Merge",
  release: "Release",
};

export const kindGradients: Record<string, string> = {
  idea: "from-indigo-500 to-purple-600",
  work: "from-emerald-500 to-cyan-600",
  merge: "from-orange-500 to-rose-600",
  release: "from-purple-500 to-pink-600",
};

export function scoreColor(score: number): string {
  if (score >= 8) return "bg-success/80 text-white";
  if (score >= 5) return "bg-warning/80 text-white";
  return "bg-danger/80 text-white";
}
