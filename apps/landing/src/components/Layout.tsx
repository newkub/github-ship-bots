import { type JSX } from "solid-js";
import TopNav from "./TopNav";

export default function Layout(props: { children: JSX.Element }) {
  return (
    <div class="min-h-screen bg-zinc-950 text-zinc-50 font-sans antialiased">
      <TopNav />
      <main class="pt-16 scroll-smooth">
        {props.children}
      </main>
    </div>
  );
}
