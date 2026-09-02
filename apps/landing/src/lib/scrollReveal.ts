import { onMount } from "solid-js";
import { animate } from "animejs";

const defaults = {
  opacity: [0, 1],
  translateY: [24, 0],
  easing: "easeOutExpo",
  duration: 900,
};

export function useScrollReveal(selector: string, stagger = 60) {
  onMount(() => {
    const targets = Array.from(document.querySelectorAll(selector));
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate([entry.target] as unknown as HTMLElement[], {
              ...defaults,
              delay: stagger,
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    targets.forEach((el) => {
      const html = el as HTMLElement;
      html.style.opacity = "0";
      observer.observe(el);
    });
  });
}
