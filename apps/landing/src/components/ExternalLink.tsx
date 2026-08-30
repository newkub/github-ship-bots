import type { JSX } from "solid-js";

export default function ExternalLink(props: {
  href: string;
  children: JSX.Element;
  class?: string;
}) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      class={props.class}
    >
      {props.children}
    </a>
  );
}
