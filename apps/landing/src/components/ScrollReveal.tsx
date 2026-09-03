import { onMount, type JSX } from "solid-js";
import { animate } from "animejs";

interface ScrollRevealProps {
  children: JSX.Element;
  class?: string;
  delay?: number;
  stagger?: number;
  selector?: string;
}

export default function ScrollReveal(props: ScrollRevealProps) {
  let ref: HTMLDivElement | undefined;

  onMount(() => {
    if (!ref) return;

    const selector = props.selector ?? ".reveal-item";
    const targets = Array.from(ref.querySelectorAll(selector));
    if (targets.length === 0) {
      targets.push(ref);
    }

    targets.forEach((el) => {
      const html = el as HTMLElement;
      html.style.opacity = "0";
      html.style.transform = "translateY(28px)";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
        if (visible.length === 0) return;

        animate(visible, {
          opacity: [0, 1],
          translateY: [28, 0],
          easing: "easeOutExpo",
          duration: 900,
          delay: props.stagger ?? 80,
        });

        visible.forEach((el) => observer.unobserve(el));
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" },
    );

    targets.forEach((el) => observer.observe(el));
  });

  return (
    <div ref={ref} class={props.class}>
      {props.children}
    </div>
  );
}
