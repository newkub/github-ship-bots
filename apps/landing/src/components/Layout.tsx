import { createSignal, onMount, type JSX } from "solid-js";
import Sidebar from "./Sidebar";

export default function Layout(props: { children: JSX.Element }) {
  const [mainRef, setMainRef] = createSignal<HTMLElement | undefined>();

  return (
    <div class="h-screen flex bg-zinc-950 text-zinc-50 font-sans antialiased">
      <aside class="w-72 h-screen flex-shrink-0 border-r border-zinc-800 bg-zinc-950/95 backdrop-blur p-6 hidden md:flex">
        <Sidebar mainRef={mainRef()} />
      </aside>
      <main
        ref={setMainRef}
        class="flex-1 h-screen overflow-y-auto scroll-smooth"
      >
        {props.children}
      </main>
    </div>
  );
}
