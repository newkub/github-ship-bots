import { Show, type Component } from "solid-js";

type IconProps = { size?: number; class?: string; strokeWidth?: number };

interface EmptyStateProps {
  icon: Component<IconProps>;
  title: string;
  subtitle: string;
  action?: { label: string; onClick: () => void };
  class?: string;
}

export default function EmptyState(props: EmptyStateProps) {
  return (
    <div class={`flex flex-col items-center justify-center p-8 text-center animate-fade-in ${props.class ?? ""}`}>
      <div class="h-20 w-20 rounded-full bg-elevated flex items-center justify-center mb-4 text-muted border border-divider">
        {(() => {
          const Icon = props.icon;
          return <Icon size={40} />;
        })()}
      </div>
      <h2 class="text-xl font-bold text-primary mb-2">{props.title}</h2>
      <p class="text-sm text-muted max-w-xs">{props.subtitle}</p>
      <Show when={props.action}>
        {(action) => (
          <button
            onClick={action().onClick}
            class="mt-6 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg active:scale-95 transition"
          >
            {action().label}
          </button>
        )}
      </Show>
    </div>
  );
}
