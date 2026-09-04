import { createSignal, onMount } from "solid-js";

const THEME_KEY = "ship-feed-theme";

type Theme = "light" | "dark";

export function createTheme() {
  const [theme, setTheme] = createSignal<Theme>("light");

  onMount(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    const initial = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initial);
    applyTheme(initial);
  });

  const applyTheme = (t: Theme) => {
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggle = () => {
    const next = theme() === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  };

  return { theme, toggle };
}
