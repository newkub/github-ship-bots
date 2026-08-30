export default function Repos() {
  return (
    <div>
      <h1 class="text-2xl font-bold mb-6">Repositories</h1>
      <div class="bg-white rounded-xl border border-gray-200 p-6">
        <p class="text-gray-600 mb-4">Install the GitHub App on repositories you want ship-feed to watch.</p>
        <a
          href="https://github.com/apps/wrikka-ship-bot/installations/new"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          Add repository
        </a>
      </div>
    </div>
  );
}
