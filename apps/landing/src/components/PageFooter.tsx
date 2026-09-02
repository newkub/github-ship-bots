import { Link } from "@tanstack/solid-router";
import { ArrowLeft, ArrowRight } from "lucide-solid";

const pages = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/features", label: "Features" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/commands", label: "Commands" },
  { to: "/install", label: "Install" },
];

export default function PageFooter(props: { current: string }) {
  const index = pages.findIndex((p) => p.to === props.current);
  const prev = pages[index - 1];
  const next = pages[index + 1];

  return (
    <nav class="py-12 bg-zinc-950 border-t border-zinc-800/60">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        {prev ? (
          <Link to={prev.to} class="group flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-indigo-400 transition">
            <ArrowLeft size={16} class="group-hover:-translate-x-0.5 transition" />
            <span>Previous: {prev.label}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={next.to} class="group flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-indigo-400 transition">
            <span>Next: {next.label}</span>
            <ArrowRight size={16} class="group-hover:translate-x-0.5 transition" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </nav>
  );
}
