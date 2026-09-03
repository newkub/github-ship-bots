export default function ScoreRing(props: { score: number; size?: number }) {
  const size = props.size ?? 32;
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, props.score / 10));
  const dash = `${pct * circumference} ${circumference}`;
  const color = props.score >= 8 ? "#10b981" : props.score >= 5 ? "#f59e0b" : "#f43f5e";

  return (
    <div class="relative flex-shrink-0" style={{ width: `${size}px`, height: `${size}px` }}>
      <svg width={size} height={size} class="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#3f3f46"
          stroke-width={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          stroke-width={stroke}
          stroke-dasharray={dash}
          stroke-linecap="round"
        />
      </svg>
      <span class="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white">
        {props.score.toFixed(1)}
      </span>
    </div>
  );
}
