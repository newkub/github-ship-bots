import { createSignal, For } from "solid-js";
import { ThumbsUp, ThumbsDown, SkipForward } from "lucide-solid";
import BottomNav from "../components/BottomNav";

type Nudge = {
  id: string;
  title: string;
  repo: string;
  action: "approve" | "reject" | "skip";
};

const mockNudges: Nudge[] = [
  { id: "1", title: "refactor auth flow", repo: "newkub/github-ship-bots", action: "approve" },
  { id: "2", title: "add dark mode", repo: "newkub/devin-skills", action: "reject" },
];

export default function Alerts() {
  const [nudges, setNudges] = createSignal<Nudge[]>(mockNudges);

  const handleAction = (id: string, action: "approve" | "reject" | "skip") => {
    console.log("nudge action", id, action);
    setNudges((list) => list.filter((n) => n.id !== id));
  };

  return (
    <div class="h-screen w-screen flex flex-col bg-gray-950 text-white">
      <div class="p-4 border-b border-gray-800">
        <h1 class="text-xl font-bold">Notifications</h1>
        <p class="text-sm text-gray-400">Quick actions for pending cards</p>
      </div>

      <div class="flex-1 overflow-auto p-4">
        <For each={nudges()}>
          {(nudge) => (
            <div class="mb-4 rounded-2xl bg-gray-900 border border-gray-800 p-4">
              <div class="text-xs text-gray-400 mb-1">{nudge.repo}</div>
              <h2 class="font-semibold mb-3">{nudge.title}</h2>
              <div class="flex gap-2">
                <button
                  onClick={() => handleAction(nudge.id, "approve")}
                  class="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 py-2 text-sm font-semibold"
                >
                  <ThumbsUp size={16} />
                  Approve
                </button>
                <button
                  onClick={() => handleAction(nudge.id, "reject")}
                  class="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-500/20 text-rose-400 py-2 text-sm font-semibold"
                >
                  <ThumbsDown size={16} />
                  Reject
                </button>
                <button
                  onClick={() => handleAction(nudge.id, "skip")}
                  class="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gray-800 text-gray-300 py-2 text-sm font-semibold"
                >
                  <SkipForward size={16} />
                  Skip
                </button>
              </div>
            </div>
          )}
        </For>

        {nudges().length === 0 && (
          <div class="text-center text-gray-500 mt-20">No pending nudges</div>
        )}
      </div>

      <BottomNav active="alerts" nudgeCount={nudges().length} />
    </div>
  );
}
