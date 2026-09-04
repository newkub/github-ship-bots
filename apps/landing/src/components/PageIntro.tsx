import { Check } from "lucide-solid";
import type { JSX } from "solid-js";

export default function PageIntro(props: {
  title: string;
  subtitle: string;
  bullets?: string[];
  details?: string[];
  children?: JSX.Element;
}) {
  return (
    <section class="py-16 sm:py-24 bg-zinc-950 border-b border-zinc-800/60 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/6 via-transparent to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance mb-5">
              {props.title}
            </h1>
            <p class="text-base sm:text-lg text-zinc-400 leading-relaxed text-balance max-w-2xl mb-6">
              {props.subtitle}
            </p>
            {props.details && props.details.length > 0 && (
              <div class="space-y-3 mb-6">
                {props.details.map((detail) => (
                  <p class="text-sm text-zinc-500 leading-relaxed">{detail}</p>
                ))}
              </div>
            )}
            {props.bullets && props.bullets.length > 0 && (
              <ul class="space-y-3">
                {props.bullets.map((bullet) => (
                  <li class="flex items-start gap-3 text-sm text-zinc-300">
                    <span class="mt-0.5 h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                      <Check size={12} />
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div class="relative w-full max-w-2xl lg:max-w-none mx-auto">
            <div class="absolute -inset-6 bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent rounded-3xl blur-2xl" />
            <div class="relative">{props.children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
