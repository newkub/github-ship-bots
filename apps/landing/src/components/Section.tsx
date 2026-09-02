import { onMount, type JSX } from "solid-js";
import { animate } from "animejs";

export default function Section(props: {
  id: string;
  children: JSX.Element;
  class?: string;
}) {
  let ref: HTMLDivElement | undefined;

  onMount(() => {
    if (!ref) return;
    const children = Array.from(ref.children);
    if (children.length === 0) return;

    children.forEach((el) => {
      const html = el as HTMLElement;
      html.style.opacity = "0";
      html.style.transform = "translateY(24px)";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          animate(children as unknown as HTMLElement[], {
            opacity: [0, 1],
            translateY: [24, 0],
            easing: "easeOutExpo",
            duration: 900,
            delay: 80,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(ref);
  });

  return (
    <section
      id={props.id}
      ref={ref}
      class={`py-20 md:py-28 ${props.class ?? ""}`}
    >
      {props.children}
    </section>
  );
}
