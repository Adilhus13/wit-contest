"use client";

import { useEffect, useMemo, useState } from "react";
import TopScoreboard from "./TopScoreboard";
import FilterSidebar from "./FilterSidebar";
import LeaderboardTable from "./LeaderboardTable";
import RightPanel from "./RightPanel";
import { mockPlayers } from "@/lib/mockData";
import { apiGet, getToken } from "@/lib/api";

type LeaderboardApiRow = {
  id: number;
  season_rank?: number | null;
  game_rank?: number | null;

  jersey_number?: number | null;
  first_name: string;
  last_name: string;

  position?: string | null;
  height_in?: number | null;
  weight_lb?: number | null;
  age?: number | null;
  experience_years?: number | null;
  college?: string | null;
};

type LeaderboardResponse = {
  data: LeaderboardApiRow[];
  links: unknown;
  meta: unknown;
};

type UiPlayerRow = {
  id: number;
  seasonRank: number;
  gameRank: number;
  jersey: number;
  firstName: string;
  lastName: string;
  pos: string;
  ht: string;
  wt: number;
  age: number;
  exp: number;
  college: string;
};

function heightInToFtIn(heightIn: number | null | undefined): string {
  if (!heightIn || heightIn <= 0) return "";
  const feet = Math.floor(heightIn / 12);
  const inches = heightIn % 12;
  return `${feet}-${inches}`;
}

function mapRow(r: LeaderboardApiRow, idx: number): UiPlayerRow {
  const rawId = (r as any).id ?? (r as any).player_id; 
  const id = Number(rawId);
  const safeId = Number.isFinite(id) && id > 0 ? id : idx + 1;

  return {
    id: safeId,
    seasonRank: Number(r.season_rank ?? idx + 1),
    gameRank: Number(r.game_rank ?? idx + 1),
    jersey: Number(r.jersey_number ?? 0),
    firstName: r.first_name ?? "",
    lastName: r.last_name ?? "",
    pos: (r.position ?? "").toUpperCase(),
    ht: heightInToFtIn(r.height_in),
    wt: Number(r.weight_lb ?? 0),
    age: Number(r.age ?? 0),
    exp: Number(r.experience_years ?? 0),
    college: r.college ?? "",
  };
}

export default function DashboardPage() {

  const [rows, setRows] = useState<UiPlayerRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("")

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const season = 2023;
  const limit = 30;
  const page = 1;
  const sort = "touchdowns";
  const order = "desc";


  
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const token = await getToken();

        const queryString = new URLSearchParams({
          season: String(season),
          limit: String(limit),
          page: String(page),
          sort,
          order,
        });

        if (debouncedSearch) queryString.set("search", debouncedSearch);

        const res = await apiGet<LeaderboardResponse>(`/leaderboard?${queryString.toString()}`, token);


        const mapped = res.data.map(mapRow);

        if (!cancelled) {
          setRows(mapped);

          setSelectedId((prev) => {
            if (mapped.length === 0) return null;
            if (prev && mapped.some((p) => p.id === prev)) return prev;
            return mapped[0].id;
          });
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season, limit, page, sort, order, debouncedSearch]);

  const selected = useMemo(
    () => rows.find((p) => p.id === selectedId) ?? rows[0],
    [rows, selectedId]
  );


  return (
    <div className="min-h-screen w-full bg-white">
      <div className="h-120">
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                rows={rows}
                selectedId={selectedId}
                onSelect={setSelectedId}
                />
                {loading && (
                  <div className="mt-3 text-sm text-black/50">Loading leaderboard…</div>
                )}
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
