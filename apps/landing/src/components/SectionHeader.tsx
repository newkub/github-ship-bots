import type { JSX } from "solid-js";
import ScrollReveal from "./ScrollReveal";

export default function SectionHeader(props: {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  children?: JSX.Element;
}) {
  const align = props.align ?? "center";
  return (
    <ScrollReveal class={`mb-12 sm:mb-16 ${align === "center" ? "text-center" : "text-left max-w-2xl"}`}>
      <h2 class="reveal-item text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance mb-4 sm:mb-5">
        {props.title}
      </h2>
      {props.subtitle && (
        <p
          class={`reveal-item text-base sm:text-lg text-zinc-400 leading-relaxed text-balance ${
            align === "center" ? "max-w-2xl mx-auto" : ""
          }`}
        >
          {props.subtitle}
        </p>
      )}
      {props.children}
    </ScrollReveal>
  );
}
