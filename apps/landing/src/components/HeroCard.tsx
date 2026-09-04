import type { JSX } from "solid-js";

export default function HeroCard(props: {
  class?: string;
  kind: string;
  title: string;
  meta: string;
  icon: JSX.Element;
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
      class={`${props.class ?? ""} absolute w-64 sm:w-72 rounded-2xl bg-zinc-900/90 p-5 shadow-2xl border ${colorMap[props.color]} backdrop-blur transition`}
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
