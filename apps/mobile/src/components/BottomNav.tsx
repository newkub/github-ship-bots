import { A } from "@solidjs/router";
import { Home, History, User } from "lucide-solid";

export default function BottomNav(props: { active: "feed" | "reviewed" | "account" }) {
  const item = (href: string, id: typeof props.active, icon: typeof Home, label: string) => (
    <A
      href={href}
      class={`flex-1 flex flex-col items-center justify-center py-2 text-xs ${
        props.active === id ? "text-indigo-400" : "text-gray-500"
      }`}
    >
      {(() => {
        const Icon = icon;
        return <Icon size={24} />;
      })()}
      <span class="mt-1">{label}</span>
    </A>
  );

  return (
    <nav class="h-16 bg-gray-900 border-t border-gray-800 flex shrink-0 safe-area-pb">
      {item("/", "feed", Home, "Feed")}
      {item("/reviewed", "reviewed", History, "Reviewed")}
      {item("/account", "account", User, "Account")}
    </nav>
  );
}
