import anime from "animejs";

export interface MicroOptions {
  float?: boolean;
  hover?: boolean;
  floatY?: number;
  hoverScale?: number;
  duration?: number;
}

export function micro(el: HTMLElement, opts: MicroOptions = {}): () => void {
  const {
    float = true,
    hover = true,
    floatY = 4,
    hoverScale = 1.02,
    duration = 2400,
  } = opts;

  const anims: any[] = [];
  let removeHover: (() => void) | undefined;

  if (float) {
    anims.push(
      anime({
        targets: el,
        translateY: [-floatY, floatY],
        duration: duration + Math.floor(Math.random() * 600),
        loop: true,
        direction: "alternate",
        easing: "easeInOutSine",
      })
    );
  }

  if (hover) {
    const onEnter = () => {
      anime({
        targets: el,
        scale: hoverScale,
        duration: 220,
        easing: "easeOutQuad",
      });
    };
    const onLeave = () => {
      anime({
        targets: el,
        scale: 1,
        duration: 220,
        easing: "easeOutQuad",
      });
    };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    removeHover = () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }

  return () => {
    anims.forEach((a) => a.pause());
    if (removeHover) removeHover();
  };
}

export function microPulse(el: HTMLElement, scale = 1.04): () => void {
  const anim = anime({
    targets: el,
    scale: [1, scale],
    duration: 1200,
    loop: true,
    direction: "alternate",
    easing: "easeInOutSine",
  });
  return () => anim.pause();
}
