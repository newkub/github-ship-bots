export type Theme = "dark" | "light";

export function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem("sf-theme") as Theme | null;
    if (saved) return saved;
  } catch {}

  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  document.documentElement.setAttribute("data-theme", theme);

  try {
    localStorage.setItem("sf-theme", theme);
  } catch {}

  const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (meta) meta.content = theme === "dark" ? "#020617" : "#f8fafc";
}

export function toggleTheme(theme: Theme): Theme {
  const next = theme === "dark" ? "light" : "dark";
  applyTheme(next);
  return next;
}
