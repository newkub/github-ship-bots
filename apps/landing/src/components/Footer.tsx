import ExternalLink from "./ExternalLink";
import { appName } from "../data";

export default function Footer() {
  return (
    <footer class="py-12 bg-zinc-950 text-center text-zinc-500 text-sm border-t border-zinc-800/60">
      <p class="max-w-xl mx-auto px-6">
        Built for the {appName} card-driven autonomous workflow. Open source on{" "}
        <ExternalLink
          href="https://github.com/newkub/github-ship-bots"
          class="text-indigo-400 hover:text-indigo-300"
        >
          GitHub
        </ExternalLink>
        .
      </p>
    </footer>
  );
}
