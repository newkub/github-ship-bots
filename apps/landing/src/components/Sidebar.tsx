import { For, createSignal, createEffect, onCleanup } from "solid-js";
import { ExternalLink } from "lucide-solid";
import { appName, dashboardUrl, installUrl, sections } from "../data";

interface SidebarProps {
  mainRef: HTMLElement | undefined;
}

export default function Sidebar(props: SidebarProps) {
  const [active, setActive] = createSignal("home");

  createEffect(() => {
    const root = props.mainRef;
    if (!root) return;

    const initialHash = window.location.hash.replace("#", "");
    if (initialHash && document.getElementById(initialHash)) {
      setActive(initialHash);
    }

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
      {
        root,
        threshold: 0.5,
      },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    onCleanup(() => observer.disconnect());
  });

  function scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActive(id);
      history.pushState(null, "", `#${id}`);
    }
  }

  return (
    <nav class="flex flex-col h-full">
      <a
        href="#home"
        onClick={(e) => {
          e.preventDefault();
          scrollTo("home");
        }}
        class="flex items-center gap-3 mb-10 px-3 py-2 group"
      >
        <img
          src="/assets/bot-logo.png"
          alt={`${appName} logo`}
          class="h-10 w-10 rounded-lg group-hover:scale-105 transition"
          width="40"
          height="40"
        />
        <span class="text-lg font-bold text-white">{appName}</span>
      </a>

      <ul class="space-y-1.5 flex-1 overflow-y-auto">
        <For each={sections}>
          {(section) => {
            const Icon = section.icon;
            const isActive = () => active() === section.id;
            return (
              <li>
                <a
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(section.id);
                  }}
                  class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
                  classList={{
                    "bg-gradient-to-r from-indigo-500/20 to-indigo-500/5 text-indigo-400 shadow-sm shadow-indigo-500/10": isActive(),
                    "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 hover:translate-x-0.5": !isActive(),
                  }}
                  aria-current={isActive() ? "page" : undefined}
                >
                  <Icon size={18} class={isActive() ? "text-indigo-400" : "text-zinc-500"} />
                  {section.label}
                </a>
              </li>
            );
          }}
        </For>
      </ul>

      <div class="mt-auto pt-6 border-t border-zinc-800 space-y-3">
        <a
          href={dashboardUrl}
          class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 hover:shadow-indigo-500/30 active:scale-95 transition"
        >
          <ExternalLink size={16} />
          Open Dashboard
        </a>
        <a
          href={installUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-zinc-700 hover:text-zinc-50 active:scale-95 transition"
        >
          Install GitHub App
        </a>
      </div>
    </nav>
  );
}
