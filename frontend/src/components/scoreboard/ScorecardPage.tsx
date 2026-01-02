"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TopScoreboard } from "./components/cards/TopScoreboard";
import { FilterSidebar } from "./components/layout/FilterSidebar";
import { LeaderboardTable } from "./components/table/LeaderboardTable";
import { RightPanel } from "./components/cards/RightPanel";
import { apiDelete, apiPost, apiPut, exportLeaderboardCsv, getToken } from "@/components/scoreboard/api";
import { CreateEditPlayerModal } from "./components/modals/CreateEditPlayerModal";
import type {
  ModalMode,
  PlayerFormValues,
  SortKey,
  SortOrder,
} from "./types";

import { toPlayerPayload } from "./mappers"
import { TopBar } from "./components/layout/TopBar";
import { DeletePlayerModal } from "./components/modals/DeletePlayerModal";
import { ScoreboardLayout } from "./components/layout/ScorecardLayout";
import { PaginationBar } from "./components/table/PaginationBar";
import { usePagination } from "./hooks/usePagination";
import { useLeaderboard } from "./hooks/useLeaderboard";
import { useDebouncedValue } from "./hooks/useDebouncedValue";

const SEASON = 2023;

export default function DashboardPage() {
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<SortKey>("season_rank");
  const [order, setOrder] = useState<SortOrder>("asc");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  
  const { page, limit, setPage, onPrev, onNext, resetPage, onLimitChange, buildFlags } = usePagination({
    initialLimit: 20,
  });
  const debouncedSearch = useDebouncedValue(search.trim(), 250);
  const { rows, meta, loading, refetch } = useLeaderboard({
    season: SEASON,
    page,
    limit,
    sort,
    order,
    search: debouncedSearch,
  });
  const { canPrev, canNext } = buildFlags(meta, loading, rows.length);

  const handleSortChange = (next: SortKey) => {
    resetPage();
    setOrder((prev) => (sort === next ? (prev === "asc" ? "desc" : "asc") : "asc"));
    setSort(next);
  }

  const handlePlayerSubmit = async (values: PlayerFormValues) => {
    const token = await getToken();
    const payload = toPlayerPayload(values);

    if (modalMode === "create") {
      await apiPost("/players", token, payload);
      resetPage();
    } else {
      if (!selectedId) return;
      await apiPut(`/players/${selectedId}`, token, payload);
    }

    setModalOpen(false);
    await refetch();
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const token = await getToken();
    await apiDelete(`/players/${selectedId}`, token);

    setDeleteOpen(false);
    await refetch();
    setSelectedId(null);
  };

  const exportCsv = useCallback(
    () => exportLeaderboardCsv({ season: SEASON, sort, order, search: debouncedSearch }),
    [sort, order, debouncedSearch]
  );

  const selected = useMemo(
    () => rows.find((p) => p.id === selectedId) ?? null,
    [rows, selectedId]
  );

  useEffect(() => {
    resetPage();
  }, [debouncedSearch, setPage]);

  useEffect(() => {
    if (rows.length === 0) {
      setSelectedId(null);
      return;
    }

    setSelectedId((prev) => (prev && rows.some((r) => r.id === prev) ? prev : rows[0].id));
  }, [rows]);



  return (
    <ScoreboardLayout
      hero={<TopScoreboard />}
      top={
        <TopBar
          search={search}
          onSearchChange={setSearch}
          actions={{
            canEdit: !!selectedId,
            canDelete: !!selectedId,
            onExport: exportCsv,
            onAdd: () => { setModalMode("create"); setModalOpen(true); },
            onEdit: () => { if (!selectedId) return; setModalMode("edit"); setModalOpen(true); },
            onDelete: () => setDeleteOpen(true),
          }}
        />
      }
      sidebar={<FilterSidebar />}
      right={selected ? <RightPanel selected={selected} /> : null}
    >
      <LeaderboardTable
        rows={rows}
        selectedId={selectedId}
        onSelect={setSelectedId}
        sort={sort}
        order={order}
        onSortChange={handleSortChange}
      />
      <PaginationBar
        loading={loading}
        meta={meta}
        page={page}
        canPrev={canPrev}
        canNext={canNext}
        onPrev={onPrev}
        onNext={onNext}
        onLimitChange={onLimitChange}
        limit={limit}
        currentCount={rows.length}
      />

      {loading && <div className="mt-3 text-sm text-black/50">Loading leaderboard…</div>}
      <CreateEditPlayerModal
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

    </ScoreboardLayout>
  );
}
