import { For, createResource, Show } from "solid-js";
import { Loader } from "lucide-solid";
import { checkoutUrl, fetchPlans, fetchSession } from "../api";

export default function Billing() {
  const [session] = createResource(() => fetchSession());
  const [plans] = createResource(() => fetchPlans());

  return (
    <div>
      <h1 class="text-2xl font-bold mb-6">Billing</h1>
      <Show when={!session.loading && !plans.loading} fallback={
        <div class="flex items-center gap-2 text-gray-500">
          <Loader size={20} class="animate-spin" />
          Loading plans...
        </div>
      }>
        <Show when={session.error || plans.error}>
          <div class="rounded-lg bg-rose-50 text-rose-700 p-4">
            {(session.error as Error | undefined)?.message ?? (plans.error as Error | undefined)?.message ?? "Failed to load billing"}
          </div>
        </Show>
        <Show when={plans() && plans()!.length > 0} fallback={
          <div class="rounded-2xl bg-gray-50 border border-gray-200 p-8 text-center text-gray-500">
            No plans available.
          </div>
        }>
          <div class="grid md:grid-cols-3 gap-4">
            <For each={plans()}>
              {(plan) => {
                const current = session()?.user?.plan === plan.id;
                return (
                  <PlanCard
                    name={plan.name}
                    price={plan.price}
                    features={plan.features}
                    current={current}
                    cta={current ? "Current" : plan.id === "pro" ? "Upgrade" : "Contact"}
                    href={current ? undefined : plan.id === "pro" ? checkoutUrl() : undefined}
                  />
                );
              }}
            </For>
          </div>
        </Show>
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
