import { ExternalLink as ExternalLinkIcon, Heart } from "lucide-solid";
import { Link } from "@tanstack/solid-router";
import { appName, dashboardUrl } from "../data";
import ExternalLink from "./ExternalLink";

const links = [
  { label: "Open Dashboard", href: dashboardUrl, type: "external" as const },
  { label: "Install GitHub App", href: "/install", type: "internal" as const },
  { label: "GitHub", href: "https://github.com/newkub/github-ship-bots", type: "external" as const },
];

export default function Footer() {
  return (
    <footer class="py-12 bg-zinc-950 border-t border-zinc-800/60">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="text-center md:text-left">
            <Link
              to="/"
              class="inline-flex items-center gap-2 text-lg font-bold text-white hover:text-indigo-400 transition"
            >
              <img src="/assets/bot-logo.png" alt={`${appName} logo`} class="h-8 w-8 rounded-lg" />
              {appName}
            </Link>
            <p class="mt-2 text-sm text-zinc-500 max-w-sm">
              Card-driven autonomous development for GitHub projects.
            </p>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-4">
            {links.map((link) =>
              link.type === "external" ? (
                <ExternalLink
                  href={link.href}
                  class="text-sm font-medium text-zinc-400 hover:text-indigo-400 transition"
                >
                  {link.label}
                </ExternalLink>
              ) : (
                <Link
                  to={link.href}
                  class="text-sm font-medium text-zinc-400 hover:text-indigo-400 transition"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>

        <div class="mt-10 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-zinc-500 text-center sm:text-left">
          <p class="flex items-center gap-1.5">
            Built for the {appName} workflow. Open source on{" "}
            <ExternalLink
              href="https://github.com/newkub/github-ship-bots"
              class="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
            >
              <ExternalLinkIcon size={14} />
              GitHub
            </ExternalLink>
            .
          </p>
          <p class="flex items-center gap-1.5">
            Made with <Heart size={14} class="text-rose-400" /> for autonomous teams.
          </p>
        </div>
      </div>
    </footer>
  );
}
