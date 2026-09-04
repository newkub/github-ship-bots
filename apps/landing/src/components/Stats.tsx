import { onMount, For } from "solid-js";
import { animate } from "animejs";
import ScrollReveal from "./ScrollReveal";
import SectionHeader from "./SectionHeader";

const stats = [
  { value: 4, suffix: "", label: "Steps from idea to shipped code" },
  { value: 8, suffix: "", label: "Built-in production features" },
  { value: 3, suffix: "", label: "Interfaces: dashboard, mobile, GitHub" },
  { value: 1, suffix: " bot", label: "Watches and ships for you" },
];

function countUp(el: HTMLElement, target: number) {
  const obj = { val: 0 };
  animate(obj, {
    val: target,
    easing: "easeOutExpo",
    duration: 1400,
    onUpdate: () => {
      el.textContent = `${Math.round(obj.val)}`;
    },
  });
}

export default function Stats() {
  let refs: HTMLSpanElement[] = [];

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const i = refs.indexOf(entry.target as HTMLSpanElement);
          if (i !== -1) countUp(refs[i]!, stats[i]!.value);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 },
    );

    refs.forEach((el) => observer.observe(el));
  });

  return (
    <section class="py-24 sm:py-32 bg-zinc-950 relative">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/8 via-transparent to-transparent" />
      <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <ScrollReveal>
          <SectionHeader
            title="Built for speed and clarity"
            subtitle="Everything you need to ship continuously, without extra tooling."
          />
        </ScrollReveal>

        <ScrollReveal selector=".stat-card" stagger={120}>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <For each={stats}>
              {(stat, i) => (
                <div class="stat-card relative rounded-2xl bg-zinc-900/60 border border-zinc-800 p-8 hover:border-indigo-500/30 hover:-translate-y-1 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-indigo-500/5 transition duration-300 group">
                  <div class="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-tr-2xl rounded-bl-[3rem] opacity-0 group-hover:opacity-100 transition duration-300" />
                  <div class="text-4xl sm:text-5xl font-extrabold text-white mb-2 tabular-nums">
                    <span ref={(el) => (refs[i()] = el)}>0</span>
                    <span class="text-indigo-400 text-2xl sm:text-3xl">{stat.suffix}</span>
                  </div>
                  <p class="text-sm text-zinc-400 leading-relaxed">{stat.label}</p>
                </div>
              )}
            </For>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
