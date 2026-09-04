import { For } from "solid-js";
import {
  Home,
  HelpCircle,
  Zap,
  ListOrdered,
  MessageSquare,
  Rocket,
} from "lucide-solid";
import { Link } from "@tanstack/solid-router";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/about", label: "About", icon: HelpCircle },
  { to: "/features", label: "Features", icon: Zap },
  { to: "/how-it-works", label: "How it works", icon: ListOrdered },
  { to: "/commands", label: "Commands", icon: MessageSquare },
  { to: "/install", label: "Install", icon: Rocket },
];

export default function BottomNav() {
  return (
    <nav class="fixed bottom-0 inset-x-0 z-40 md:hidden h-16 bg-zinc-950/95 backdrop-blur border-t border-zinc-800">
      <div class="grid grid-cols-6 h-full">
        <For each={navItems}>
          {(item) => {
            const Icon = item.icon;
            return (
              <Link
                to={item.to}
                activeOptions={{ exact: true }}
                class="flex flex-col items-center justify-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition"
                activeProps={{ class: "text-indigo-400" }}
              >
                <Icon size={20} />
                <span class="text-[10px]">{item.label}</span>
              </Link>
            );
          }}
        </For>
      </div>
    </nav>
  );
}
