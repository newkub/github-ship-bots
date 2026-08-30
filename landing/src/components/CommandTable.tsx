import { For } from "solid-js";
import { commands } from "../data";

export default function CommandTable() {
  return (
    <section class="py-24 sm:py-32">
      <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12">
        Commands
      </h2>
      <div class="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow">
        <table class="w-full text-left text-sm sm:text-base">
          <thead class="bg-zinc-800 text-zinc-200">
            <tr>
              <th class="px-4 sm:px-6 py-3 font-semibold">Command</th>
              <th class="px-4 sm:px-6 py-3 font-semibold">On issue</th>
              <th class="px-4 sm:px-6 py-3 font-semibold">On pull request</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800 text-zinc-300">
            <For each={commands}>
              {(row) => (
                <tr>
                  <td class="px-4 sm:px-6 py-4 font-mono font-medium text-white">
                    {row.cmd}
                  </td>
                  <td class="px-4 sm:px-6 py-4">{row.issue}</td>
                  <td class="px-4 sm:px-6 py-4">{row.pr}</td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </section>
  );
}
