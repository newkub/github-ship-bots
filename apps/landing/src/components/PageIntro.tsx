import type { JSX } from "solid-js";
import ScrollReveal from "./ScrollReveal";

export default function PageIntro(props: {
  title: string;
  subtitle: string;
  bullets?: string[];
  details?: string[];
  children?: JSX.Element;
}) {
  return (
    <section class="py-16 sm:py-20 bg-zinc-950 border-b border-zinc-800/60">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <h1 class="reveal-item text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance mb-5">
              {props.title}
            </h1>
            <p class="reveal-item text-base sm:text-lg text-zinc-400 leading-relaxed text-balance max-w-2xl mb-6">
              {props.subtitle}
            </p>
            {props.details && props.details.length > 0 && (
              <div class="reveal-item space-y-3 mb-6">
                {props.details.map((detail) => (
                  <p class="text-sm text-zinc-500 leading-relaxed">{detail}</p>
                ))}
              </div>
            )}
            {props.bullets && props.bullets.length > 0 && (
              <ul class="reveal-item space-y-3">
                {props.bullets.map((bullet) => (
                  <li class="flex items-start gap-3 text-sm text-zinc-300">
                    <span class="mt-0.5 h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                      <span class="text-xs">✓</span>
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </ScrollReveal>
          <ScrollReveal class="max-w-xl lg:max-w-none mx-auto w-full" delay={120}>
            {props.children}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
