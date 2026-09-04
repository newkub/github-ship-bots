export default function Skeleton(props: { class?: string }) {
  return (
    <div
      class={`animate-pulse rounded-lg bg-gray-200 ${props.class ?? ""}`}
    />
  );
}
