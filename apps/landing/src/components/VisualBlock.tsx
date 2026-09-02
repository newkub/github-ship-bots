import { For } from "solid-js";
import {
  Bot,
  Brain,
  CheckCircle2,
  ChevronRight,
  Database,
  Eye,
  GitBranch,
  GitPullRequest,
  Layers,
  MessageSquare,
  Monitor,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Terminal,
  ThumbsUp,
  X,
  Zap,
} from "lucide-solid";

type Variant = "about" | "features" | "ecosystem" | "how-it-works" | "commands" | "install";

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

function WindowChrome(props: { title: string; children: any }) {
  return (
    <div class="relative rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-2xl shadow-black/30">
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

function AboutVisual() {
  const steps = [
    { label: "Idea", icon: Sparkles, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
    { label: "Approve", icon: ThumbsUp, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { label: "Ship", icon: Rocket, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  ];
  return (
    <WindowChrome title="ship-feed">
      <div class="flex items-center gap-3">
        <For each={steps}>
          {(step, i) => {
            const Icon = step.icon;
            const last = i() === steps.length - 1;
            return (
              <>
                <div class={`flex-1 rounded-xl border p-3 ${step.color}`}>
                  <Icon size={18} class="mb-2" />
                  <div class="text-xs font-semibold">{step.label}</div>
                </div>
                {!last && <ChevronRight size={16} class="text-zinc-600" />}
              </>
            );
          }}
        </For>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-2">
        <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-center">
          <div class="text-[10px] text-zinc-500 uppercase">Card</div>
          <div class="text-xs text-zinc-300">scored</div>
        </div>
        <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-center">
          <div class="text-[10px] text-zinc-500 uppercase">Evidence</div>
          <div class="text-xs text-zinc-300">attached</div>
        </div>
        <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-2 text-center">
          <div class="text-[10px] text-zinc-500 uppercase">Learning</div>
          <div class="text-xs text-zinc-300">updated</div>
        </div>
      </div>
    </WindowChrome>
  );
}

function FeaturesVisual() {
  const items = [
    { label: "Fast", icon: Zap, color: "text-indigo-400 bg-indigo-500/10" },
    { label: "Smart", icon: Brain, color: "text-purple-400 bg-purple-500/10" },
    { label: "Auto", icon: Bot, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "Safe", icon: ShieldCheck, color: "text-orange-400 bg-orange-500/10" },
  ];
  return (
    <WindowChrome title="ship-feed / dashboard">
      <div class="grid grid-cols-2 gap-3">
        <For each={items}>
          {(item) => {
            const Icon = item.icon;
            return (
              <div class={`rounded-xl p-3 border border-zinc-800/60 ${item.color} bg-zinc-950`}>
                <Icon size={18} class="mb-1.5" />
                <div class="text-xs font-semibold">{item.label}</div>
              </div>
            );
          }}
        </For>
      </div>
      <div class="mt-3 rounded-lg bg-zinc-950 border border-zinc-800 p-3 flex items-center gap-3">
        <div class="h-7 w-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">8.4</div>
        <div class="flex-1">
          <div class="text-xs text-zinc-300">Auto score for every card</div>
          <div class="text-[10px] text-zinc-500">impact · risk · effect</div>
        </div>
      </div>
    </WindowChrome>
  );
}

function EcosystemVisual() {
  const nodes = [
    { label: "GitHub bot", icon: MessageSquare },
    { label: "Mobile PWA", icon: Smartphone },
    { label: "Web dashboard", icon: Monitor },
    { label: "Evidence vault", icon: Database },
    { label: "Test oracle", icon: Eye },
    { label: "Learning", icon: Brain },
  ];
  return (
    <WindowChrome title="ecosystem">
      <div class="relative h-48">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 z-10">
          <Rocket size={24} />
        </div>
        <For each={nodes}>
          {(node, i) => {
            const Icon = node.icon;
            const angle = (i() / nodes.length) * 2 * Math.PI - Math.PI / 2;
            const x = 50 + 38 * Math.cos(angle);
            const y = 50 + 38 * Math.sin(angle);
            return (
              <div
                class="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div class="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                  <Icon size={14} />
                </div>
                <span class="text-[9px] text-zinc-500 whitespace-nowrap">{node.label}</span>
              </div>
            );
          }}
        </For>
      </div>
    </WindowChrome>
  );
}

function HowItWorksVisual() {
  const steps = [
    { title: "Connect", icon: GitPullRequest, desc: "repo" },
    { title: "Rules", icon: Layers, desc: "policy" },
    { title: "Vote", icon: ThumbsUp, desc: "approve" },
    { title: "Ship", icon: Rocket, desc: "deploy" },
  ];
  return (
    <WindowChrome title="how it works">
      <div class="grid grid-cols-2 gap-3">
        <For each={steps}>
          {(step, i) => {
            const Icon = step.icon;
            return (
              <div class="rounded-xl bg-zinc-950 border border-zinc-800 p-3 hover:border-indigo-500/30 transition">
                <div class="flex items-center justify-between mb-2">
                  <Icon size={16} class="text-indigo-400" />
                  <span class="text-[10px] text-zinc-600 font-mono">0{i() + 1}</span>
                </div>
                <div class="text-xs font-semibold text-zinc-200">{step.title}</div>
                <div class="text-[10px] text-zinc-500">{step.desc}</div>
              </div>
            );
          }}
        </For>
      </div>
    </WindowChrome>
  );
}

function CommandsVisual() {
  const lines = [
    { text: "/approve", color: "text-emerald-400" },
    { text: "/reject", color: "text-rose-400" },
    { text: "/ship", color: "text-indigo-400" },
  ];
  return (
    <WindowChrome title="terminal">
      <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-3 font-mono text-xs space-y-2">
        <div class="text-zinc-500">$ ship-feed --help</div>
        <For each={lines}>
          {(line) => (
            <div class="flex items-center gap-2">
              <span class="text-zinc-600">$</span>
              <span class={line.color}>{line.text}</span>
            </div>
          )}
        </For>
        <div class="text-zinc-500">// bot replies with card status</div>
      </div>
    </WindowChrome>
  );
}

function InstallVisual() {
  return (
    <WindowChrome title="GitHub Marketplace">
      <div class="rounded-xl bg-zinc-950 border border-zinc-800 p-4 flex items-center gap-4">
        <div class="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-indigo-400">
          <Rocket size={24} />
        </div>
        <div class="flex-1">
          <div class="text-sm font-semibold text-white">wrikka-ship-bot</div>
          <div class="text-xs text-zinc-500">Card-driven shipping assistant</div>
        </div>
        <div class="px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-semibold">
          Install
        </div>
      </div>
      <div class="mt-3 grid grid-cols-3 gap-2 text-center">
        <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-2">
          <CheckCircle2 size={14} class="mx-auto text-emerald-400 mb-1" />
          <span class="text-[9px] text-zinc-500">Free plan</span>
        </div>
        <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-2">
          <CheckCircle2 size={14} class="mx-auto text-emerald-400 mb-1" />
          <span class="text-[9px] text-zinc-500">Unlimited repos</span>
        </div>
        <div class="rounded-lg bg-zinc-950 border border-zinc-800 p-2">
          <X size={14} class="mx-auto text-zinc-500 mb-1" />
          <span class="text-[9px] text-zinc-500">No card needed</span>
        </div>
      </div>
    </WindowChrome>
  );
}
