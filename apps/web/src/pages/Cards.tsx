import { For } from "solid-js";
import { useQuery } from "@tanstack/solid-query";
import { fetchCards, updateCardStatus } from "../api";
import { Check, X } from "lucide-solid";

export default function Cards() {
  const query = useQuery(() => ({ queryKey: ["cards"], queryFn: fetchCards }));

  const onStatus = async (id: string, status: "approved" | "rejected") => {
    await updateCardStatus(id, status);
    query.refetch();
  };

  return (
    <div>
      <h1 class="text-2xl font-bold mb-6">Cards</h1>
      <div class="grid gap-4">
        <For each={query.data}>
          {(card) => (
            <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div class="flex justify-between items-start mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-xs uppercase tracking-wide font-semibold text-indigo-600">{card.kind}</span>
                  <span class="text-xs text-gray-500">{card.repoFullName}</span>
                </div>
                <span
                  class={`text-xs px-2 py-1 rounded-full ${
                    card.status === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : card.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {card.status}
                </span>
              </div>
              <h3 class="font-semibold text-lg mb-1">{card.title}</h3>
              <p class="text-gray-600 text-sm mb-4">{card.description}</p>

              <div class="flex items-center gap-2">
                <button
                  onClick={() => onStatus(card.id, "approved")}
                  class="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700"
                >
                  <Check size={16} /> Approve
                </button>
                <button
                  onClick={() => onStatus(card.id, "rejected")}
                  class="flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                >
                  <X size={16} /> Reject
                </button>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
