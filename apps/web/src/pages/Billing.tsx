import { createResource, Show } from "solid-js";
import { checkoutUrl, fetchSession } from "../api";

export default function Billing() {
  const [session] = createResource(() => fetchSession());

  return (
    <div>
      <h1 class="text-2xl font-bold mb-6">Billing</h1>
      <Show when={!session.loading} fallback={<div class="text-gray-500">Loading plans...</div>}>
        <Show when={session.error}>
          <div class="rounded-lg bg-rose-50 text-rose-700 p-4">{(session.error as Error).message}</div>
        </Show>
        <div class="grid md:grid-cols-3 gap-4">
          <PlanCard
            name="Free"
            price="$0"
            features={["3 cards/day", "Public repos", "Email support"]}
            current={session()?.user?.plan === "free"}
          />
          <PlanCard
            name="Pro"
            price="$19"
            features={["Unlimited cards", "Private repos", "Evidence vault", "Priority support"]}
            cta={session()?.user?.plan === "pro" ? "Current" : "Upgrade"}
            href={session()?.user?.plan === "pro" ? undefined : checkoutUrl()}
          />
          <PlanCard name="Team" price="$49" features={["Everything in Pro", "Multiple seats", "Custom CI", "SLA"]} cta="Contact" />
        </div>
      </Show>
    </div>
  );
}

function PlanCard(props: { name: string; price: string; features: string[]; current?: boolean; cta?: string; href?: string }) {
  return (
    <div class={`bg-white rounded-xl border p-6 ${props.current ? "border-indigo-500 ring-1 ring-indigo-500" : "border-gray-200"}`}>
      <h2 class="text-lg font-semibold">{props.name}</h2>
      <div class="text-3xl font-bold my-2">{props.price}<span class="text-sm text-gray-500 font-normal">/mo</span></div>
      <ul class="text-sm text-gray-600 space-y-2 mb-6">
        {props.features.map((f) => (
          <li class="flex items-center gap-2">{f}</li>
        ))}
      </ul>
      {props.cta && props.href ? (
        <a
          href={props.href}
          class={`block text-center w-full py-2 rounded-lg font-medium ${
            props.current ? "bg-gray-100 text-gray-700" : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {props.cta}
        </a>
      ) : (
        <div class="block text-center w-full py-2 rounded-lg bg-gray-100 text-gray-700 font-medium">
          {props.current ? "Current" : (props.cta ?? "—")}
        </div>
      )}
    </div>
  );
}
