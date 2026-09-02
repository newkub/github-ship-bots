import type { JSX } from "solid-js";

export default function PageIntro(props: {
  title: string;
  subtitle: string;
  bullets?: string[];
  children?: JSX.Element;
}) {
  return (
    <section class="py-16 sm:py-20 bg-zinc-950 border-b border-zinc-800/60">
      <div class="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance mb-5">
              {props.title}
            </h1>
            <p class="text-base sm:text-lg text-zinc-400 leading-relaxed text-balance max-w-2xl mb-6">
              {props.subtitle}
            </p>
            {props.bullets && props.bullets.length > 0 && (
              <ul class="space-y-3">
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
          </div>
          <div class="max-w-xl lg:max-w-none mx-auto w-full">
            {props.children}
          </div>
        </div>
      </div>
    </section>
  );
}
