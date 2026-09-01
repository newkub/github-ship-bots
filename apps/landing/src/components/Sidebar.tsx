import { For, createSignal, onMount, onCleanup } from "solid-js";
import { sections, appName } from "../data";

interface SidebarProps {
  mainRef: HTMLElement | undefined;
}

export default function Sidebar(props: SidebarProps) {
  const [active, setActive] = createSignal("home");

  onMount(() => {
    if (!props.mainRef) return;

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
        root: props.mainRef,
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
        class="flex items-center gap-3 mb-10 px-3 py-2"
      >
        <img
          src="assets/bot-logo.png"
          alt={`${appName} logo`}
          class="h-10 w-10 rounded-lg"
          width="40"
          height="40"
        />
        <span class="text-lg font-bold text-white">{appName}</span>
      </a>

      <ul class="space-y-2 flex-1 overflow-y-auto">
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
                  class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition"
                  classList={{
                    "bg-indigo-500/10 text-indigo-400": isActive(),
                    "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200": !isActive(),
                  }}
                  aria-current={isActive() ? "page" : undefined}
                >
                  <Icon size={18} />
                  {section.label}
                </a>
              </li>
            );
          }}
        </For>
      </ul>

      <div class="mt-auto pt-6 border-t border-zinc-800">
        <a
          href="https://github.com/apps/wrikka-ship-bot"
          target="_blank"
          rel="noopener noreferrer"
          class="block w-full rounded-xl bg-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-600 transition"
        >
          Install
        </a>
      </div>
    </nav>
  );
}
