import { createSignal, onMount } from "solid-js";
import { Sun, Moon } from "lucide-solid";
import { getInitialTheme, toggleTheme, type Theme } from "../lib/theme";

export default function ThemeToggle() {
  const [theme, setTheme] = createSignal<Theme>("dark");

  onMount(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  });

  const handleToggle = () => {
    const next = toggleTheme(theme());
    setTheme(next);
  };

  return (
    <button
      onClick={handleToggle}
      class="flex items-center gap-3 w-full rounded-xl bg-elevated px-4 py-3 text-left border border-divider active:scale-95 transition"
      aria-label="Toggle theme"
    >
      {theme() === "dark" ? (
        <Moon size={20} class="text-accent" />
      ) : (
        <Sun size={20} class="text-warning" />
      )}
      <span class="flex-1 text-primary font-medium">Theme</span>
      <span class="text-muted text-sm capitalize">{theme()}</span>
    </button>
  );
}
