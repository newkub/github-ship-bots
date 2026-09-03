export default function Metric(props: { label: string; value: string }) {
  return (
    <div class="bg-black/20 backdrop-blur rounded-xl p-2 border border-white/10">
      <div class="uppercase tracking-wider opacity-80 mb-1 text-white/70 text-[10px]">{props.label}</div>
      <div class="font-bold capitalize text-white">{props.value}</div>
    </div>
  );
}
