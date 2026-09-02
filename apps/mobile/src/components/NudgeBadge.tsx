interface NudgeBadgeProps {
  count: number;
}

export default function NudgeBadge(props: NudgeBadgeProps) {
  if (props.count <= 0) return null;
  return (
    <span class="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold px-1.5 border-2 border-gray-900">
      {props.count > 99 ? "99+" : props.count}
    </span>
  );
}
