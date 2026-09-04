import { onCleanup, onMount, type JSX } from "solid-js";
import { micro, type MicroOptions } from "../lib/anime";

export default function Micro(
  props: MicroOptions & {
    children: JSX.Element;
    class?: string;
  }
) {
  let el: HTMLElement | undefined;

  onMount(() => {
    if (!el) return;
    const cleanup = micro(el, {
      float: props.float,
      hover: props.hover,
      floatY: props.floatY,
      hoverScale: props.hoverScale,
      duration: props.duration,
    });
    onCleanup(cleanup);
  });

  return (
    <div
      ref={(node: HTMLElement) => {
        el = node;
      }}
      class={props.class}
    >
      {props.children}
    </div>
  );
}
