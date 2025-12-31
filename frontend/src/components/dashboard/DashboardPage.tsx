"use client";

import { useEffect, useMemo, useState } from "react";
import TopScoreboard from "./TopScoreboard";
import FilterSidebar from "./FilterSidebar";
import LeaderboardTable from "./LeaderboardTable";
import RightPanel from "./RightPanel";
import { apiDelete, apiGet, apiPost, apiPut, getToken } from "@/lib/api";
import PlayerModal, { PlayerFormValues } from "./PlayerModal";

export type SortKey = "season_rank" | "game_rank" | "first_name" | "last_name" | 'jersey_number' | 'age' | 'position' | 'height_in' | 'weight_lb' | 'experience_years' | 'college';
export type SortOrder = "asc" | "desc";

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
  headshot_url?: string;
};

type LeaderboardResponse = {
  data: LeaderboardApiRow[];
  links: unknown;
  meta: PaginatorMeta;
};

export type UiPlayerRow = {
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
  headshot_url?: string;
};

type PaginatorMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
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
    headshot_url: r.headshot_url ?? "",

  };
}

function toNullOrNumber(v: number | ""): number | null {
  return v === "" ? null : Number(v);
}

function toPlayerPayload(values: PlayerFormValues) {
  return {
    first_name: values.first_name.trim(),
    last_name: values.last_name.trim(),
    jersey_number: Number(values.jersey_number),
    position: values.position?.trim() || null,
    status: values.status,
    height_in: toNullOrNumber(values.height_in),
    weight_lb: toNullOrNumber(values.weight_lb),
    age: toNullOrNumber(values.age),
    experience_years: toNullOrNumber(values.experience_years),
    college: values.college?.trim() || null,
  };
}

export default function DashboardPage() {

  const [rows, setRows] = useState<UiPlayerRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("")
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<PaginatorMeta | null>(null);
  const [limit, setLimit] = useState<number>(20);
  const [sort, setSort] = useState<SortKey>("season_rank");
  const [order, setOrder] = useState<SortOrder>("asc");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const season = 2023;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);
  
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
          setMeta(res.meta ?? null);

          setSelectedId((prev) => {
            if (mapped.length === 0) return null;
            if (prev && mapped.some((p) => p.id === prev)) return prev;
            return mapped[0].id;
          });
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setRows([]);
          setMeta(null);
          setSelectedId(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season, limit, page, sort, order, debouncedSearch, refreshKey]);

  const selected = useMemo(
    () => rows.find((p) => p.id === selectedId) ?? rows[0],
    [rows, selectedId]
  );

  const canPrev = page > 1;
  const canNext = meta ? page < meta.last_page : rows.length === limit; // fallback if meta missing

  function handleSortChange(next: SortKey) {
    setPage(1);
    setOrder((prev) => (sort === next ? (prev === "asc" ? "desc" : "asc") : "asc"));
    setSort(next);
  }

  const handlePlayerSubmit = async (values: PlayerFormValues) => {
  const token = await getToken();
  const payload = toPlayerPayload(values);

  if (modalMode === "create") {
    await apiPost("/players", token, payload);
    setPage(1);
  } else {
    if (!selectedId) return;
    await apiPut(`/players/${selectedId}`, token, payload);
  }

  setModalOpen(false);
  setRefreshKey((k) => k + 1);
  };

  async function exportCsv() {
    const token = await getToken();

    const qs = new URLSearchParams({
      season: String(season),
      sort,
      order,
    });

    if (debouncedSearch) qs.set("search", debouncedSearch);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/leaderboard/export?${qs.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/csv",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Export failed (${res.status}): ${text}`);
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `49ers_leaderboard_${season}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  }

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

          <button
            type="button"
            onClick={() => exportCsv().catch(console.error)}
            className="text-[14px] font-semibold tracking-[0.28em] text-[#C00000] uppercase hover:opacity-80"
          >
            EXPORT DATA
          </button>
          <button
            type="button"
            onClick={() => {
              setModalMode("create");
              setModalOpen(true);
            }}
            className="ml-auto h-9 px-4 rounded-md bg-[#C00000] text-white text-sm font-extrabold tracking-[0.16em] uppercase"
          >
            ADD PLAYER
          </button>
          <button
            type="button"
            disabled={!selectedId}
            onClick={() => {
              if (!selectedId) return;
              setModalMode("edit");
              setModalOpen(true);
            }}
            className={`h-9 px-4 rounded-md text-sm font-extrabold tracking-[0.16em] uppercase ${
              selectedId
                ? "bg-[#B3995D] text-black hover:bg-[#A88C4F]"
                : "bg-black/10 text-black/30"
            }`}
          >
            EDIT PLAYER
          </button>
          <button
            type="button"
            disabled={!selectedId}
            onClick={() => setDeleteOpen(true)}
            className={`h-9 px-4 rounded-md text-sm font-extrabold tracking-[0.16em] uppercase ${
              selectedId
                ? "bg-black text-white hover:bg-black/85"
                : "bg-black/10 text-black/30"
            }`}
          >
            DELETE
          </button>

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
                  sort={sort}
                  order={order}
                  onSortChange={handleSortChange}
                />

                {/* PAGINATION CONTROLS */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-black/60">
                    {meta ? (
                      <>
                        Showing{" "}
                        <span className="font-semibold text-black/80">{meta.from ?? "-"}</span>–
                        <span className="font-semibold text-black/80">{meta.to ?? "-"}</span> of{" "}
                        <span className="font-semibold text-black/80">{meta.total}</span>
                      </>
                    ) : (
                      <span>{loading ? "Loading…" : `Showing ${rows.length} rows`}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-black/60">ROWS</span>
                      <select
                        value={limit}
                        onChange={(e) => {
                          setPage(1);
                          setLimit(Number(e.target.value));
                        }}
                        className="h-9 rounded-md border border-black/20 px-2 text-sm outline-none"
                      >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      disabled={!canPrev || loading}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={`h-9 px-4 rounded-md border text-sm font-semibold ${
                        !canPrev || loading
                          ? "border-black/10 text-black/30"
                          : "border-black/20 text-black/70 hover:bg-black/3"
                      }`}
                    >
                      Prev
                    </button>

                    <div className="text-sm font-semibold text-black/70">
                      Page <span className="text-black">{page}</span>
                      {meta ? (
                        <>
                          {" "}
                          / <span className="text-black">{meta.last_page}</span>
                        </>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      disabled={!canNext || loading}
                      onClick={() => setPage((p) => p + 1)}
                      className={`h-9 px-4 rounded-md border text-sm font-semibold ${
                        !canNext || loading
                          ? "border-black/10 text-black/30"
                          : "border-black/20 text-black/70 hover:bg-black/3"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>

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
      <PlayerModal
        open={modalOpen}
        mode={modalMode}
        initial={modalMode === "edit" ? selected : null}
        onClose={() => setModalOpen(false)}
          onSubmit={handlePlayerSubmit}
      />
      {deleteOpen ? (
        <div className="fixed inset-0 z-120">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeleteOpen(false)}
            aria-label="Close delete dialog"
          />
          <div className="absolute left-1/2 top-1/2 w-130 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.35)] border border-black/10">
            <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
              <div className="text-[13px] font-extrabold tracking-[0.28em] text-[#C00000]">
                DELETE PLAYER
              </div>
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="h-9 w-9 rounded-md border border-black/15 hover:bg-black/3 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="text-sm text-black/70">
                This will permanently delete{" "}
                <span className="font-semibold text-black">
                  {selected?.firstName} {selected?.lastName}
                </span>
                {selected?.jersey ? (
                  <>
                    {" "}
                    (<span className="font-semibold">#{selected.jersey}</span>)
                  </>
                ) : null}
                . Continue?
              </div>
            </div>

            <div className="px-6 py-5 border-t border-black/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="h-10 px-5 rounded-md border border-black/15 text-sm font-semibold text-black/70 hover:bg-black/3"
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (!selectedId) return;
                  const token = await getToken();
                  await apiDelete(`/players/${selectedId}`, token);

                  setDeleteOpen(false);
                  setRefreshKey((k) => k + 1);

                  setSelectedId(null);
                }}
                className="h-10 px-6 rounded-md bg-[#C00000] text-white text-sm font-extrabold tracking-[0.16em] uppercase hover:bg-[#A00000]"
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      ) : null}


    </div>
  );
}
