import { For, createSignal, onMount, onCleanup } from "solid-js";
import { Menu, X, Zap } from "lucide-solid";
import { appName, dashboardUrl, installUrl, sections } from "../data";

export default function MobileNav() {
  const [open, setOpen] = createSignal(false);

  function scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setOpen(false);
    }
  }

  onMount(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    onCleanup(() => document.removeEventListener("keydown", onKey));
  });

  return (
    <header class="fixed top-0 left-0 right-0 z-50 md:hidden">
      <div class="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur px-4 py-3">
        <div class="flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("home");
            }}
            class="flex items-center gap-2"
          >
            <img
              src="assets/bot-logo.png"
              alt={`${appName} logo`}
              class="h-8 w-8 rounded-lg"
              width="32"
              height="32"
            />
            <span class="font-bold text-white">{appName}</span>
          </a>

          <button
            onClick={() => setOpen((o) => !o)}
            class="h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
            aria-label={open() ? "Close menu" : "Open menu"}
            aria-expanded={open()}
          >
            {open() ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open() && (
        <div class="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur px-4 pb-5 shadow-2xl shadow-black/50">
          <nav class="mt-3 space-y-1">
            <For each={sections}>
              {(section) => {
                const Icon = section.icon;
                return (
                  <a
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(section.id);
                    }}
                    class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
                  >
                    <Icon size={18} />
                    {section.label}
                  </a>
                );
              }}
            </For>
          </nav>

          <div class="mt-4 grid grid-cols-2 gap-3">
            <a
              href={dashboardUrl}
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition"
            >
              <Zap size={16} />
              Open Dashboard
            </a>
            <a
              href={installUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 transition"
            >
              Install App
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
