import { logWarn } from "@ship-feed/shared";

export type Theme = "dark" | "light";

const THEMES: readonly Theme[] = ["dark", "light"];

function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && THEMES.some((theme) => theme === value);
}

export function getInitialTheme(): Theme {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      const saved = localStorage.getItem("sf-theme");
      if (saved && isTheme(saved)) return saved;
    } catch (error) {
      logWarn({ message: "Failed to read theme from localStorage", error: error instanceof Error ? error.message : String(error) });
    }
  }

  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  document.documentElement.setAttribute("data-theme", theme);

  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem("sf-theme", theme);
    } catch (error) {
      logWarn({ message: "Failed to persist theme to localStorage", error: error instanceof Error ? error.message : String(error) });
    }
  }

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && meta instanceof HTMLMetaElement) {
    meta.content = theme === "dark" ? "#020617" : "#f8fafc";
  }
}

export function toggleTheme(theme: Theme): Theme {
  const next = theme === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
