import type { Component } from "solid-js";

type IconType = Component<{ size?: number; class?: string; strokeWidth?: number }>;

export default function ModeButton(props: {
  active: boolean;
  onClick: () => void;
  icon: IconType;
  label: string;
}) {
  return (
    <button
      onClick={props.onClick}
      class={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition active:scale-95 ${
        props.active
          ? "bg-accent text-white shadow-sm"
          : "bg-transparent text-muted hover:text-primary"
      }`}
    >
      {(() => {
        const Icon = props.icon;
        return <Icon size={14} />;
      })()}
      {props.label}
    </button>
  );
}
