import {
  Globe,
  LayoutDashboard,
  Plus,
  Search,
} from "lucide-solid";
import SectionHeader from "./SectionHeader";
import { dashboardUrl } from "../data";
import Sidebar from "./dashboard/Sidebar";
import Stats from "./dashboard/Stats";
import Kanban from "./dashboard/Kanban";
import Health from "./dashboard/Health";

export default function DashboardPreview() {
  return (
    <section class="py-20 sm:py-28 bg-zinc-950 relative overflow-hidden">
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/8 via-transparent to-transparent" />
      <div class="absolute inset-0 hero-grid opacity-40" />

      <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeader
          title="A dashboard that ships for you"
          subtitle="Approve, reject, and track every card from one place. The bot keeps the queue moving while you stay in control."
          align="center"
        >
          <a
            href={dashboardUrl}
            class="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white hover:border-zinc-700 transition"
          >
            <LayoutDashboard size={18} />
            Explore the dashboard
          </a>
        </SectionHeader>

        <div class="relative max-w-6xl mx-auto">
          <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-30" />
          <div class="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50">
            <div class="flex items-center gap-3 px-4 py-3 bg-zinc-950 border-b border-zinc-800">
              <div class="flex items-center gap-1.5">
                <div class="h-3 w-3 rounded-full bg-rose-500" />
                <div class="h-3 w-3 rounded-full bg-amber-500" />
                <div class="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <div class="ml-4 flex-1 max-w-md rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-zinc-500 flex items-center gap-2 border border-zinc-800">
                <Globe size={12} />
                <span class="truncate">ship-feed.newkubise.workers.dev/dashboard</span>
              </div>
            </div>

            <div class="p-4 sm:p-6 bg-zinc-950 min-h-[28rem]">
              <div class="grid grid-cols-1 lg:grid-cols-[14rem_1fr] gap-6">
                <Sidebar />

                <div class="flex-1 min-w-0">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 class="text-xl font-bold text-white flex items-center gap-2">
                        <LayoutDashboard size={20} class="text-indigo-400" />
                        Dashboard
                      </h3>
                      <p class="text-xs text-zinc-500 mt-0.5">Realtime view of your ship pipeline</p>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-zinc-400">
                        <Search size={14} />
                        <span class="text-xs">Search cards...</span>
                      </div>
                      <button class="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-600 transition">
                        <Plus size={14} />
                        New idea
                      </button>
                    </div>
                  </div>

                  <Stats />
                  <Kanban />
                  <Health />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
