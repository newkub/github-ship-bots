import { A } from "@solidjs/router";
import { Home, History, User, Bell } from "lucide-solid";
import NudgeBadge from "./NudgeBadge";

export default function BottomNav(props: {
  active: "feed" | "reviewed" | "alerts" | "account";
  nudgeCount?: number;
}) {
  const item = (
    href: string,
    id: typeof props.active,
    icon: typeof Home,
    label: string,
    badge?: number
  ) => (
    <A
      href={href}
      class={`relative flex-1 flex flex-col items-center justify-center py-2 text-xs ${
        props.active === id ? "text-indigo-400" : "text-gray-500"
      }`}
    >
      {(() => {
        const Icon = icon;
        return (
          <span class="relative">
            <Icon size={24} />
            {badge !== undefined && badge > 0 && <NudgeBadge count={badge} />}
          </span>
        );
      })()}
      <span class="mt-1">{label}</span>
    </A>
  );

  return (
    <nav class="h-16 bg-gray-900 border-t border-gray-800 flex shrink-0 safe-area-pb">
      {item("/", "feed", Home, "Feed", props.nudgeCount)}
      {item("/reviewed", "reviewed", History, "Reviewed")}
      {item("/alerts", "alerts", Bell, "Alerts")}
      {item("/account", "account", User, "Account")}
    </nav>
  );
}
