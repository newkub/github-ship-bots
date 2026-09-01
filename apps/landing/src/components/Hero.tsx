import {
  Bot,
  GitPullRequest,
  Layers,
  MessageSquare,
  Rocket,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Zap,
} from "lucide-solid";
import ExternalLink from "./ExternalLink";

export default function Hero() {
  return (
    <section class="relative min-h-screen flex items-center overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 animate-gradient" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />
      <div class="absolute inset-0 hero-grid opacity-60" />
      <div class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl animate-pulse-glow" />
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl animate-pulse-glow" style="animation-delay: -4s" />

      <div class="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="text-center lg:text-left">
            <div class="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-sm font-medium text-indigo-400 mb-6">
              <Sparkles size={16} />
              <span>Card-driven autonomous development</span>
            </div>

            <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
              ship-feed
            </h1>

            <p class="mt-6 text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Turn ideas into cards, approve or reject them, and let agents
              implement, test, gather evidence, and ship — continuously.
            </p>

            <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <ExternalLink
                href="https://github.com/apps/wrikka-ship-bot"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition"
              >
                <Zap size={18} />
                Install on GitHub
              </ExternalLink>
              <ExternalLink
                href="https://github.com/newkub/github-ship-bots"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-800 px-6 py-3.5 text-base font-semibold text-white shadow hover:bg-zinc-700 transition"
              >
                <Bot size={18} />
                View source
              </ExternalLink>
            </div>
          </div>

          <div class="relative flex justify-center items-center h-[28rem] lg:h-auto">
            <div class="absolute inset-0 rounded-full bg-indigo-500/10 blur-3xl" />

            <div class="relative w-80 h-80 sm:w-96 sm:h-96">
              <Card
                kind="idea"
                title="Dark mode idea"
                meta="impact medium · risk low"
                icon={<Sparkles size={20} />}
                rotate="-6"
                top="-6"
                left="-4"
                color="indigo"
              />

              <Card
                kind="work"
                title="Implement login"
                meta="effect high · phase mvp"
                icon={<Rocket size={20} />}
                rotate="3"
                top="16"
                left="18"
                color="emerald"
              />

              <Card
                kind="merge"
                title="PR #42 ready"
                meta="approved · score 8.4"
                icon={<GitPullRequest size={20} />}
                rotate="-3"
                bottom="20"
                right="-8"
                color="orange"
              />

              <Card
                kind="release"
                title="Ship v1.2.0"
                meta="evidence ready"
                icon={<Layers size={20} />}
                rotate="6"
                bottom="-4"
                right="16"
                color="purple"
              />

              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex h-24 w-24 items-center justify-center rounded-2xl bg-zinc-950 border-4 border-indigo-500 shadow-2xl shadow-indigo-500/30">
                <img
                  src="/assets/bot-logo.png"
                  alt="ship-feed logo"
                  class="h-16 w-16 rounded-lg"
                />
              </div>

              <div class="absolute -bottom-2 -right-2 z-20 flex items-center gap-2 rounded-full bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 shadow-lg">
                <ThumbsUp size={14} class="text-emerald-400" />
                <ThumbsDown size={14} class="text-rose-400" />
                <span class="text-xs font-medium text-zinc-300">Vote</span>
              </div>

              <div class="absolute top-4 -left-8 z-20 flex items-center gap-2 rounded-full bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 shadow-lg">
                <MessageSquare size={14} class="text-indigo-400" />
                <span class="text-xs font-medium text-zinc-300">/approve</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Card(props: {
  kind: string;
  title: string;
  meta: string;
  icon: any;
  rotate: string;
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  color: "indigo" | "emerald" | "orange" | "purple";
}) {
  const colorMap = {
    indigo: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
    emerald: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    orange: "border-orange-500/30 text-orange-400 bg-orange-500/10",
    purple: "border-purple-500/30 text-purple-400 bg-purple-500/10",
  };

  const style: any = {
    "--rotate": `${props.rotate}deg`,
    zIndex: 1,
  };
  if (props.top !== undefined) style.top = `${props.top}rem`;
  if (props.bottom !== undefined) style.bottom = `${props.bottom}rem`;
  if (props.left !== undefined) style.left = `${props.left}rem`;
  if (props.right !== undefined) style.right = `${props.right}rem`;

  return (
    <div
      class={`absolute w-64 sm:w-72 rounded-2xl bg-zinc-900/90 p-5 shadow-2xl border ${colorMap[props.color]} backdrop-blur animate-float`}
      style={style}
    >
      <div class="flex items-start gap-3">
        <div
          class={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${colorMap[props.color].split(" ")[2]}`}
        >
          {props.icon}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {props.kind}
            </span>
          </div>
          <div class="h-3 w-36 mt-1 rounded bg-zinc-700" />
          <div class="mt-2 text-sm font-medium text-white truncate">
            {props.title}
          </div>
          <div class="mt-1 text-xs text-zinc-500">{props.meta}</div>
        </div>
      </div>
    </div>
  );
}
