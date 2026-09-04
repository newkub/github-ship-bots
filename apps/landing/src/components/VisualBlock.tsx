import type { JSX } from "solid-js";
import Micro from "./Micro";
import AboutVisual from "./visuals/AboutVisual";
import FeaturesVisual from "./visuals/FeaturesVisual";
import EcosystemVisual from "./visuals/EcosystemVisual";
import HowItWorksVisual from "./visuals/HowItWorksVisual";
import CommandsVisual from "./visuals/CommandsVisual";
import InstallVisual from "./visuals/InstallVisual";

export type Variant = "about" | "features" | "ecosystem" | "how-it-works" | "commands" | "install";

export function WindowChrome(props: { title: string; children: any }) {
  return (
    <div class="relative rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl shadow-black/30">
      <div class="flex items-center gap-3 px-4 py-3 bg-zinc-950 border-b border-zinc-800/80">
        <div class="flex items-center gap-1.5">
          <div class="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
          <div class="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
          <div class="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <span class="text-xs font-medium text-zinc-500">{props.title}</span>
      </div>
      <div class="p-4 sm:p-5">{props.children}</div>
    </div>
  );
}

const visuals: Record<Variant, () => JSX.Element> = {
  about: AboutVisual,
  features: FeaturesVisual,
  ecosystem: EcosystemVisual,
  "how-it-works": HowItWorksVisual,
  commands: CommandsVisual,
  install: InstallVisual,
};

export default function VisualBlock(props: { variant: Variant }) {
  const Visual = visuals[props.variant];
  return (
    <Micro
      float
      floatY={5}
      class="relative rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-zinc-950 p-px shadow-2xl shadow-indigo-500/10"
    >
      <div class="relative rounded-2xl bg-zinc-950/95 border border-zinc-800 overflow-hidden">
        <Visual />
      </div>
    </Micro>
  );
}
