import AboutVisual from "./visuals/AboutVisual";
import FeaturesVisual from "./visuals/FeaturesVisual";
import EcosystemVisual from "./visuals/EcosystemVisual";
import HowItWorksVisual from "./visuals/HowItWorksVisual";
import CommandsVisual from "./visuals/CommandsVisual";
import InstallVisual from "./visuals/InstallVisual";

export type Variant = "about" | "features" | "ecosystem" | "how-it-works" | "commands" | "install";

export function WindowChrome(props: { title: string; children: any }) {
  return (
    <div class="reveal-visual relative rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl shadow-black/30 hover:border-indigo-500/20 hover:shadow-indigo-500/10 hover:-translate-y-1 hover:scale-[1.01] transition duration-500 group">
      <div class="flex items-center gap-3 px-4 py-3 bg-zinc-950 border-b border-zinc-800">
        <div class="flex items-center gap-1.5">
          <div class="h-2.5 w-2.5 rounded-full bg-rose-500" />
          <div class="h-2.5 w-2.5 rounded-full bg-amber-500" />
          <div class="h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </div>
        <span class="text-xs font-medium text-zinc-500">{props.title}</span>
      </div>
      <div class="p-4">{props.children}</div>
    </div>
  );
}

export default function VisualBlock(props: { variant: Variant }) {
  switch (props.variant) {
    case "about":
      return <AboutVisual />;
    case "features":
      return <FeaturesVisual />;
    case "ecosystem":
      return <EcosystemVisual />;
    case "how-it-works":
      return <HowItWorksVisual />;
    case "commands":
      return <CommandsVisual />;
    case "install":
      return <InstallVisual />;
  }
}
