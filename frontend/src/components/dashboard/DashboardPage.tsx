"use client";

import { useMemo, useState } from "react";
import TopScoreboard from "./TopScoreboard";
import FilterSidebar from "./FilterSidebar";
import LeaderboardTable from "./LeaderboardTable";
import RightPanel from "./RightPanel";
import { mockPlayers } from "@/lib/mockData";

export default function DashboardPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = useMemo(
    () => mockPlayers.find((p) => p.id === selectedId) ?? mockPlayers[0],
    [selectedId]
  );

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="h-full">
        <TopScoreboard />
      </div>

      <div className="bg-white border-b border-black/10">
        <div className="px-6 py-4 relative flex items-center gap-4">
          <div className="inline-flex items-center gap-3 rounded-lg bg-white border-[3px] border-[#C00000] shadow-[0_10px_18px_rgba(0,0,0,0.12)] px-3">
            <div className="h-9 w-9 rounded-md flex items-center justify-center">
              <svg width="18" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 5h18l-7 8v5l-4 1v-6L3 5z" fill="#B3995D" />
              </svg>
            </div>
            <div className="text-[14px] font-extrabold tracking-[0.22em] text-[#B3995D] uppercase">
              FILTER
            </div>
          </div>

          <input
            placeholder="SEARCH"
            className="h-8.5 w-70 rounded-md border border-black/20 px-4 text-sm outline-none placeholder:text-black/30"
          />

          <div className="text-[14px] font-semibold tracking-[0.28em] text-[#C00000] uppercase">
            EXPORT DATA
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-280px-78px)]">
        <FilterSidebar />

        <main className="flex-1 bg-white">
          <div>
            <div className="flex gap-8 items-start">
              <div className="flex-1 min-w-0">
                <LeaderboardTable
                  rows={mockPlayers.slice(0, 30)}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              </div>
            </div>
          </div>
        </main>
      <aside className="w-110 shrink-0 fixed right-12 bottom-12">
          { selectedId && (
              <RightPanel selected={selected} />
            )}
      </aside>
      </div>
    </div>
  );
}
