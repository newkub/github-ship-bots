import type { ShipCard } from "@ship-feed/shared";
import { kindGradients, kindIcons, kindLabels, scoreColor } from "./card/data";

export { kindIcons, kindLabels, scoreColor };
import { useSwipe } from "./card/useSwipe";
import Body from "./card/Body";
import Controls from "./card/Controls";
import Overlays from "./card/Overlays";

interface CardProps {
  card: ShipCard;
  active: boolean;
  hidden: boolean;
  stackIndex?: number;
  expanded: boolean;
  prompt?: string;
  onToggleExpand: () => void;
  onSwipe: (direction: "approve" | "reject") => void;
  onAddPrompt: () => void;
}

export default function Card(props: CardProps) {
  const swipe = useSwipe({
    active: props.active,
    onToggleExpand: props.onToggleExpand,
    onSwipe: props.onSwipe,
  });

  const gradient = () => kindGradients[props.card.kind] ?? kindGradients.idea;
  const stack = () => props.stackIndex ?? 0;

  const transform = () => {
    if (swipe.exiting()) {
      const x = swipe.exiting() === "approve" ? "120%" : "-120%";
      const r = swipe.exiting() === "approve" ? 10 : -10;
      return `translate3d(${x}, 0, 0) rotateZ(${r}deg) scale(0.96)`;
    }

    if (props.hidden) return "translate3d(0, 0, 0) scale(0.9)";

    if (stack() === 1) return "translate3d(0, 14px, 0) scale(0.96)";
    if (stack() > 1) return "translate3d(0, 28px, 0) scale(0.92)";

    const x = swipe.deltaX();
    const y = swipe.deltaY();
    const r = x / 22;
    const s = 1 - Math.min(0.06, Math.abs(x) / 3000);
    return `translate3d(${x}px, ${y}px, 0) rotateZ(${r}deg) scale(${s})`;
  };

  const containerClass = () => {
    if (swipe.exiting()) {
      return "z-50 opacity-100 transition-transform duration-200 ease-out";
    }
    if (props.hidden || stack() > 1) {
      return "-z-10 opacity-0";
    }
    if (props.active) {
      return `z-10 opacity-100 ${swipe.dragging() ? "" : "transition-all duration-200 ease-out"}`;
    }
    return "z-0 opacity-40 transition-all duration-300 ease-out";
  };

  return (
    <div
      class={`absolute inset-0 w-full h-full select-none ${containerClass()}`}
      style={{ transform: transform(), "will-change": "transform", "touch-action": "none" }}
      onTouchStart={swipe.onTouchStart}
      onTouchMove={swipe.onTouchMove}
      onTouchEnd={swipe.onTouchEnd}
      onMouseDown={swipe.onTouchStart}
      onMouseMove={swipe.onTouchMove}
      onMouseUp={swipe.onTouchEnd}
      onMouseLeave={swipe.onTouchEnd}
    >
      <div class="h-full w-full relative overflow-hidden rounded-3xl shadow-2xl">
        <div class={`absolute inset-0 bg-gradient-to-br ${gradient()} opacity-95`} />
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 to-transparent" />

        <Overlays likeOpacity={swipe.likeOpacity()} nopeOpacity={swipe.nopeOpacity()} />

        <div class="absolute inset-0 flex items-center justify-center opacity-10">
          {(() => {
            const Icon = kindIcons[props.card.kind];
            return <Icon size={160} class="text-white drop-shadow-lg" />;
          })()}
        </div>

        <div class="absolute top-0 left-0 right-0 p-5 flex justify-between items-start z-20">
          <span class="px-3 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur text-white uppercase tracking-wider border border-white/10">
            {kindLabels[props.card.kind]}
          </span>
          <span class={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur ${scoreColor(props.card.score)}`}>
            score {props.card.score.toFixed(1)}
          </span>
        </div>

        <div class="absolute inset-x-0 bottom-0 p-5 z-20 card-gradient max-h-[75%] overflow-y-auto no-scrollbar">
          <Body
            card={props.card}
            expanded={props.expanded}
            prompt={props.prompt}
          />
          <Controls
            expanded={props.expanded}
            prompt={props.prompt}
            onToggleExpand={props.onToggleExpand}
            onAddPrompt={props.onAddPrompt}
            onReject={(e) => {
              e.stopPropagation();
              swipe.triggerSwipe("reject");
            }}
            onApprove={(e) => {
              e.stopPropagation();
              swipe.triggerSwipe("approve");
            }}
          />
        </div>
      </div>
    </div>
  );
}
