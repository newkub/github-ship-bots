import { For, Show, createSignal, onMount, onCleanup } from "solid-js";
import {
  ExternalLink,
  Home,
  HelpCircle,
  Zap,
  ListOrdered,
  MessageSquare,
  Rocket,
  Menu,
  X,
} from "lucide-solid";
import { Link } from "@tanstack/solid-router";
import { appName, dashboardUrl } from "../data";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/about", label: "About", icon: HelpCircle },
  { to: "/features", label: "Features", icon: Zap },
  { to: "/how-it-works", label: "How it works", icon: ListOrdered },
  { to: "/commands", label: "Commands", icon: MessageSquare },
];

export default function TopNav() {
  const [open, setOpen] = createSignal(false);
  const [scrolled, setScrolled] = createSignal(false);

  onMount(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("scroll", onScroll);
    document.addEventListener("keydown", onKey);
    onScroll();
    onCleanup(() => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
    });
  });

  const navLinkClass =
    "px-3 py-2 rounded-lg text-sm font-medium transition text-zinc-400 hover:text-white hover:bg-zinc-900";
  const activeClass = "text-indigo-400 bg-indigo-500/10";

  return (
    <>
      <header
        class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        classList={{
          "bg-zinc-950/90 backdrop-blur border-b border-zinc-800/50": scrolled(),
          "bg-transparent": !scrolled(),
        }}
      >
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between gap-4">
            <Link to="/" class="flex items-center gap-2.5 group shrink-0">
              <img
                src="/assets/bot-logo.png"
                alt={`${appName} logo`}
                class="h-9 w-9 rounded-lg group-hover:scale-105 transition"
                width="36"
                height="36"
                loading="eager"
                decoding="async"
              />
              <span class="text-lg font-bold text-white hidden sm:inline">{appName}</span>
            </Link>

            <nav class="hidden md:flex items-center justify-center flex-1 gap-1">
              <For each={navItems}>
                {(item) => (
                  <Link
                    to={item.to}
                    class={navLinkClass}
                    activeProps={{ class: activeClass }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                )}
              </For>
            </nav>

            <div class="hidden md:flex items-center gap-3 shrink-0">
              <a
                href={dashboardUrl}
                class="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3.5 py-2 text-sm font-semibold text-white hover:bg-zinc-700 transition"
              >
                <ExternalLink size={14} />
                Dashboard
              </a>
              <Link
                to="/install"
                class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
              >
                <Rocket size={16} />
                Install
              </Link>
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
              <For each={navItems}>
                {(item) => (
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
                    activeProps={{ class: "text-indigo-400 bg-indigo-500/10" }}
                  >
                    {item.label}
                  </Link>
                )}
              </For>
            </nav>
            <div class="mt-4 grid grid-cols-2 gap-3">
              <a
                href={dashboardUrl}
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 transition"
              >
                <ExternalLink size={14} />
                Dashboard
              </a>
              <Link
                to="/install"
                onClick={() => setOpen(false)}
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition"
              >
                <Rocket size={16} />
                Install
              </Link>
            </div>
          </div>
        </Show>
      </header>
    </>
  );
}
