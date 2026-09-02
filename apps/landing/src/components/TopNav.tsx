import { For, Show, createSignal, onMount, onCleanup } from "solid-js";
import { ExternalLink, Menu, X, Zap } from "lucide-solid";
import { appName, dashboardUrl, installUrl, sections } from "../data";

export default function TopNav() {
  const [open, setOpen] = createSignal(false);
  const [active, setActive] = createSignal("home");
  const [scrolled, setScrolled] = createSignal(false);

  function scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActive(id);
      setOpen(false);
      history.pushState(null, "", `#${id}`);
    }
  }

  onMount(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll);
    onScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const id = entry.target.id;
            setActive(id);
            if (window.location.hash !== `#${id}`) {
              history.replaceState(null, "", `#${id}`);
            }
          }
        });
      },
      { threshold: 0.5 },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    onCleanup(() => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    });
  });

  return (
    <header
      class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      classList={{
        "bg-zinc-950/80 backdrop-blur border-b border-zinc-800/50": scrolled(),
        "bg-transparent": !scrolled(),
      }}
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("home");
            }}
            class="flex items-center gap-2.5 group"
          >
            <img
              src="/assets/bot-logo.png"
              alt={`${appName} logo`}
              class="h-9 w-9 rounded-lg group-hover:scale-105 transition"
              width="36"
              height="36"
            />
            <span class="text-lg font-bold text-white">{appName}</span>
          </a>

          <nav class="hidden md:flex items-center gap-1">
            <For each={sections}>
              {(section) => {
                const isActive = () => active() === section.id;
                return (
                  <a
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(section.id);
                    }}
                    class="px-3 py-2 rounded-lg text-sm font-medium transition"
                    classList={{
                      "text-indigo-400 bg-indigo-500/10": isActive(),
                      "text-zinc-400 hover:text-white hover:bg-zinc-900": !isActive(),
                    }}
                  >
                    {section.label}
                  </a>
                );
              }}
            </For>
          </nav>

          <div class="hidden md:flex items-center gap-3">
            <a
              href={dashboardUrl}
              class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
            >
              <Zap size={16} />
              Dashboard
            </a>
            <a
              href={installUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-zinc-800 transition"
            >
              <ExternalLink size={14} />
              Install
            </a>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            class="md:hidden h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
            aria-label={open() ? "Close menu" : "Open menu"}
            aria-expanded={open()}
          >
            {open() ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <Show when={open()}>
        <div class="md:hidden border-b border-zinc-800 bg-zinc-950/95 backdrop-blur px-4 pb-5 shadow-2xl shadow-black/50">
          <nav class="mt-3 space-y-1">
            <For each={sections}>
              {(section) => (
                <a
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(section.id);
                  }}
                  class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
                >
                  {section.label}
                </a>
              )}
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
      </Show>
    </header>
  );
}
