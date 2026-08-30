export default function Settings() {
  return (
    <div>
      <h1 class="text-2xl font-bold mb-6">Settings</h1>
      <div class="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
          <input
            type="text"
            readOnly
            value="https://github-ship-bots.newkubise.workers.dev/webhook"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Approved label</label>
          <input
            type="text"
            value="approved"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Rejected label</label>
          <input
            type="text"
            value="rejected"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
          Save changes
        </button>
      </div>
    </div>
  );
}
