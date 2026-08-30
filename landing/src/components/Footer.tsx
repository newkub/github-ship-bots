import ExternalLink from "./ExternalLink";

export default function Footer() {
  return (
    <footer class="py-12 text-center text-zinc-500 text-sm">
      <p>
        Built for the ship-feed card-driven workflow. Open source on{" "}
        <ExternalLink
          href="https://github.com/newkub/github-ship-bots"
          class="text-orange-400 hover:text-orange-300"
        >
          GitHub
        </ExternalLink>
        .
      </p>
    </footer>
  );
}
