import { For, Show, createResource, createSignal } from "solid-js";
import { Check, Download, Loader, Puzzle, Sparkles, TestTube, Wand2, XCircle } from "lucide-solid";
import { fetchPlugins, installPlugin, uninstallPlugin } from "../api";

const iconMap: Record<string, typeof Puzzle> = {
  Sparkles,
  TestTube,
  Check,
  Shield: Puzzle,
  Wand2,
  Puzzle,
};

export default function Marketplace() {
  const [plugins, { refetch }] = createResource(fetchPlugins);
  const [pending, setPending] = createSignal<Record<string, boolean>>({});
  const [error, setError] = createSignal<string | null>(null);

  const toggle = async (id: string, installed: boolean) => {
    setPending((p) => ({ ...p, [id]: true }));
    setError(null);
    try {
      if (installed) {
        await uninstallPlugin(id);
      } else {
        await installPlugin(id);
      }
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${installed ? "uninstall" : "install"} plugin`);
    } finally {
      setPending((p) => ({ ...p, [id]: false }));
    }
  };

  return (
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Skill Marketplace</h1>
        <p class="text-sm text-gray-500 mt-1">Browse and install ship skills for your repositories.</p>
      </div>

      <Show when={plugins.loading}>
        <div class="flex items-center justify-center py-12 text-gray-500">
          <Loader size={24} class="animate-spin mr-2" />
          Loading marketplace...
        </div>
      </Show>

      <Show when={plugins.error}>
        <div class="rounded-2xl bg-rose-50 border border-rose-100 p-6 text-rose-700">
          Failed to load marketplace.
        </div>
      </Show>

      <Show when={error()}>
        <div class="rounded-2xl bg-rose-50 border border-rose-100 p-4 mb-6 text-rose-700 flex items-center gap-2">
          <XCircle size={18} />
          {error()}
        </div>
      </Show>

      <Show when={!plugins.loading && !plugins.error && (plugins() ?? []).length === 0}>
        <div class="rounded-2xl bg-gray-50 border border-gray-200 p-8 text-center text-gray-500">
          No skills available in the marketplace yet.
        </div>
      </Show>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <For each={plugins() ?? []}>
          {(skill) => {
            const Icon = iconMap[skill.icon] ?? Puzzle;
            const busy = () => pending()[skill.id] ?? false;
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
                  onClick={() => toggle(skill.id, skill.installed)}
                  disabled={busy()}
                  class={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    skill.installed
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  } disabled:opacity-60`}
                >
                  {busy() ? (
                    <>
                      <Loader size={14} class="animate-spin" />
                      {skill.installed ? "Uninstalling..." : "Installing..."}
                    </>
                  ) : skill.installed ? (
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
