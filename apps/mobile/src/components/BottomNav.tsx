import { A } from "@solidjs/router";
import { Home, History, User, Bell } from "lucide-solid";
import NudgeBadge from "./NudgeBadge";
import type { Component } from "solid-js";

type NavId = "feed" | "reviewed" | "alerts" | "account";
type IconType = Component<{ size?: number; class?: string }>;

interface BottomNavProps {
  active: NavId;
  nudgeCount?: number;
}

export default function BottomNav(props: BottomNavProps) {
  const item = (href: string, id: NavId, icon: IconType, label: string, badge?: number) => (
    <A
      href={href}
      class={`relative flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition active:scale-95 ${
        props.active === id ? "text-accent" : "text-muted hover:text-secondary"
      } ${props.active === id ? "bg-accent/15" : ""}`}
    >
      {(() => {
        const Icon = icon;
        return (
          <span class="relative">
            <Icon size={22} />
            {badge !== undefined && badge > 0 && <NudgeBadge count={badge} />}
          </span>
        );
      })()}
      <span class="mt-1 text-[11px] font-medium">{label}</span>
    </A>
  );

  return (
    <nav class="h-16 bg-surface border-t border-divider flex shrink-0 safe-area-pb px-2 gap-1">
      {item("/", "feed", Home, "Feed", props.nudgeCount)}
      {item("/reviewed", "reviewed", History, "Reviewed")}
      {item("/alerts", "alerts", Bell, "Alerts")}
      {item("/account", "account", User, "Account")}
    </nav>
  );
}
