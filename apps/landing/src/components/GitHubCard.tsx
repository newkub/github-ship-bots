import {
  CheckCircle2,
  CircleDot,
  GitMerge,
  GitPullRequest,
  XCircle,
} from "lucide-solid";

export interface GitHubCardLabel {
  text: string;
  color: "emerald" | "rose" | "orange" | "zinc";
}

export interface GitHubCardProps {
  title: string;
  type: "issue" | "pull-request";
  state?: "open" | "closed" | "merged";
  number?: number;
  labels?: GitHubCardLabel[];
  comment?: string;
  botReply?: string;
}

const stateConfig = {
  open: { icon: CircleDot, text: "Open", color: "text-emerald-400" },
  closed: { icon: XCircle, text: "Closed", color: "text-rose-400" },
  merged: { icon: GitMerge, text: "Merged", color: "text-purple-400" },
};

const labelColor: Record<GitHubCardLabel["color"], string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  zinc: "bg-zinc-800 text-zinc-300 border-zinc-700",
};

export default function GitHubCard(props: GitHubCardProps) {
  const TypeIcon = props.type === "issue" ? CircleDot : GitPullRequest;
  const state = props.state ?? "open";
  const StateIcon = stateConfig[state].icon;

  return (
    <div class="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-lg w-full">
      <div class="flex items-start gap-3">
        <TypeIcon
          size={22}
          class={
            state === "open"
              ? "text-emerald-400"
              : state === "closed"
              ? "text-rose-400"
              : "text-purple-400"
          }
        />
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-white truncate">
            {props.title}
          </h4>
          <p class="text-xs text-zinc-500 mt-0.5">
            {props.type === "issue" ? "Issue" : "Pull request"}{" "}
            {props.number ? `#${props.number}` : ""}
          </p>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <span
              class={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${stateConfig[state].color}`}
            >
              <StateIcon size={12} />
              {stateConfig[state].text}
            </span>
            {props.labels?.map((label) => (
              <span
                class={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${labelColor[label.color]}`}
              >
                {label.text}
              </span>
            ))}
          </div>
        </div>
      </div>

      {props.comment && (
        <div class="mt-4 rounded-xl bg-zinc-900 p-3 border border-zinc-800">
          <p class="text-xs text-zinc-500 mb-1">user commented</p>
          <p class="text-sm text-zinc-200 font-mono">{props.comment}</p>
        </div>
      )}

      {props.botReply && (
        <div class="mt-3 rounded-xl bg-orange-500/10 p-3 border border-orange-500/20">
          <p class="text-xs text-orange-400 mb-1 flex items-center gap-1">
            <span class="h-2 w-2 rounded-full bg-orange-500" />
            github-ship-bots
          </p>
          <p class="text-sm text-zinc-200">{props.botReply}</p>
        </div>
      )}
    </div>
  );
}
