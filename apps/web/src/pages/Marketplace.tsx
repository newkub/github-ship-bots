import { createSignal, For } from "solid-js";
import { Check, Download, Puzzle, Shield, Sparkles, TestTube, Wand2 } from "lucide-solid";

type Skill = {
  id: string;
  name: string;
  description: string;
  installs: number;
  installed: boolean;
  icon: typeof Puzzle;
};

const skills: Skill[] = [
  {
    id: "ship-svelte",
    name: "ship-svelte",
    description: "Auto-implement and ship Svelte components.",
    installs: 1200,
    installed: false,
    icon: Sparkles,
  },
  {
    id: "test-coverage",
    name: "test-coverage",
    description: "Generate tests from traffic and coverage gaps.",
    installs: 890,
    installed: false,
    icon: TestTube,
  },
  {
    id: "issue-resolver",
    name: "issue-resolver",
    description: "Parse issues, plan, and open PRs automatically.",
    installs: 2100,
    installed: true,
    icon: Check,
  },
  {
    id: "code-review",
    name: "code-review",
    description: "Suggest smart comments and review PRs.",
    installs: 1500,
    installed: false,
    icon: Shield,
  },
  {
    id: "auto-deploy",
    name: "auto-deploy",
    description: "Deploy, monitor health, and rollback on failure.",
    installs: 760,
    installed: false,
    icon: Wand2,
  },
];

export default function Marketplace() {
  const [items, setItems] = createSignal<Skill[]>(skills);

  const toggle = (id: string) => {
    setItems((list) =>
      list.map((s) => (s.id === id ? { ...s, installed: !s.installed } : s))
    );
  };

  return (
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Skill Marketplace</h1>
        <p class="text-sm text-gray-500 mt-1">Browse and install ship skills for your repositories.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <For each={items()}>
          {(skill) => {
            const Icon = skill.icon;
            return (
              <div class="rounded-2xl bg-white border border-gray-200 p-5 hover:shadow-md transition">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon size={20} />
                  </div>
                  <span class="text-xs text-gray-500">{skill.installs.toLocaleString()} installs</span>
                </div>
                <h3 class="font-semibold text-gray-900 mb-1">{skill.name}</h3>
                <p class="text-sm text-gray-500 mb-4">{skill.description}</p>
                <button
                  onClick={() => toggle(skill.id)}
                  class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    skill.installed
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {skill.installed ? (
                    <>
                      <Check size={14} />
                      Installed
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      Install
                    </>
                  )}
                </button>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
