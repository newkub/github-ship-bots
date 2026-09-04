import type { JSX } from "solid-js";

export default function Section(props: {
  id: string;
  children: JSX.Element;
  class?: string;
}) {
  return (
    <section
      id={props.id}
      class={`py-20 md:py-28 ${props.class ?? ""}`}
    >
      {props.children}
    </section>
  );
}
