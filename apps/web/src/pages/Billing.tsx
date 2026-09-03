import { For, createResource, Show, createSignal } from "solid-js";
import { Loader, CheckCircle2, AlertCircle, ArrowRight } from "lucide-solid";
import { useSearchParams } from "@solidjs/router";
import { createCheckout, fetchPlans, fetchSession } from "../api";

export default function Billing() {
  const [session] = createResource(() => fetchSession());
  const [plans] = createResource(() => fetchPlans());
  const [searchParams] = useSearchParams();
  const [busy, setBusy] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const startCheckout = async () => {
    setBusy(true);
    setError(null);
    try {
      const { url } = await createCheckout();
      if (!url) throw new Error("No checkout URL");
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  };

  const currentPlan = () => session()?.user?.plan;

  return (
    <div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Billing</h1>
      <p class="text-sm text-gray-500 mb-6">Manage your plan and billing details.</p>

      <Show when={searchParams.success}>
        <div class="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-emerald-700 mb-6 flex items-center gap-2">
          <CheckCircle2 size={20} />
          Welcome aboard — your subscription is being activated.
        </div>
      </Show>

      <Show when={searchParams.canceled}>
        <div class="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-amber-700 mb-6">
          Checkout canceled. You can upgrade any time.
        </div>
      </Show>

      <Show when={session.loading || plans.loading}>
        <div class="flex items-center gap-2 text-gray-500">
          <Loader size={20} class="animate-spin" />
          Loading plans...
        </div>
      </Show>

      <Show when={session.error || plans.error}>
        <div class="rounded-2xl bg-rose-50 border border-rose-100 p-6 text-rose-700">
          <div class="flex items-center gap-2 mb-2">
            <AlertCircle size={20} />
            <span class="font-medium">Failed to load billing</span>
          </div>
          <p class="text-sm">{(session.error as Error | undefined)?.message ?? (plans.error as Error | undefined)?.message ?? "Unknown error"}</p>
        </div>
      </Show>

      <Show when={error()}>
        <div class="rounded-2xl bg-rose-50 border border-rose-100 p-4 text-rose-700 mb-6">
          {error()}
        </div>
      </Show>

      <Show when={!session.loading && !plans.loading && !session.error && !plans.error}>
        <Show when={plans() && plans()!.length > 0} fallback={
          <div class="rounded-2xl bg-gray-50 border border-gray-200 p-8 text-center text-gray-500">
            No plans available.
          </div>
        }>
          <div class="grid md:grid-cols-3 gap-4">
            <For each={plans()}>
              {(plan) => {
                const current = currentPlan() === plan.id;
                const cta = current ? "Current" : plan.id === "pro" ? "Upgrade" : "Contact";
                return (
                  <PlanCard
                    name={plan.name}
                    price={plan.price}
                    features={plan.features}
                    current={current}
                    cta={cta}
                    busy={busy() && !current}
                    onCta={current ? undefined : plan.id === "pro" ? startCheckout : undefined}
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

function PlanCard(props: {
  name: string;
  price: string;
  features: string[];
  current?: boolean;
  cta?: string;
  busy?: boolean;
  onCta?: () => void;
}) {
  return (
    <div class={`bg-white rounded-xl border p-6 ${props.current ? "border-indigo-500 ring-1 ring-indigo-500" : "border-gray-200"}`}>
      <h2 class="text-lg font-semibold text-gray-900">{props.name}</h2>
      <div class="text-3xl font-bold my-2 text-gray-900">
        {props.price}<span class="text-sm text-gray-500 font-normal">/mo</span>
      </div>
      <ul class="text-sm text-gray-600 space-y-2 mb-6">
        {props.features.map((f) => (
          <li class="flex items-center gap-2">
            <CheckCircle2 size={14} class="text-emerald-500" />
            {f}
          </li>
        ))}
      </ul>
      {props.onCta ? (
        <button
          onClick={props.onCta}
          disabled={props.busy}
          class="flex items-center justify-center gap-2 w-full py-2 rounded-lg font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {props.busy ? (
            <>
              <Loader size={16} class="animate-spin" /> Redirecting…
            </>
          ) : (
            <>
              {props.cta} <ArrowRight size={16} />
            </>
          )}
        </button>
      ) : (
        <div class="block text-center w-full py-2 rounded-lg bg-gray-100 text-gray-700 font-medium">
          {props.cta ?? "—"}
        </div>
      )}
    </div>
  );
}
