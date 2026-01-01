"use client";

import { useEffect, useMemo, useState } from "react";
import TopScoreboard from "./components/TopScoreboard";
import {FilterSidebar} from "./components/FilterSidebar";
import LeaderboardTable from "./components/LeaderboardTable";
import RightPanel from "./components/RightPanel";
import { apiDelete, apiGet, apiPost, apiPut, getToken } from "@/components/scoreboard/api";
import PlayerModal, { PlayerFormValues } from "./components/PlayerModal";
import type {
  LeaderboardResponse,
  SortKey,
  SortOrder,
  UiPlayerRow,
  PaginatorMeta,
} from "./types";

import { mapRow, toPlayerPayload} from "./mappers"
import { TopBar } from "./components/TopBar";
import { DeletePlayerModal } from "./components/DeletePlayerModal";

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

  const handleDelete = async () => {
    if (!selectedId) return;
    const token = await getToken();
    await apiDelete(`/players/${selectedId}`, token);

    setDeleteOpen(false);
    setRefreshKey((k) => k + 1);
    setSelectedId(null);
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

      <TopBar
        search={search}
        onSearchChange={setSearch}
        canEdit={!!selectedId}
        canDelete={!!selectedId}
        onExport={() => exportCsv().catch(console.error)}
        onAdd={() => {
          setModalMode("create");
          setModalOpen(true);
        }}
        onEdit={() => {
          if (!selectedId) return;
          setModalMode("edit");
          setModalOpen(true);
        }}
        onDelete={() => setDeleteOpen(true)}
      />

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
      <DeletePlayerModal
        open={deleteOpen}
        player={selected}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        confirmDisabled={!selectedId}
      />
    </div>
  );
}
