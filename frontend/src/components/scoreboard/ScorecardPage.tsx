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
import { useRouter, useSearchParams } from "next/navigation";

const SEASON = 2023;

export default function DashboardPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const search = sp.get("search") ?? "";
  const sort = (sp.get("sort") ?? "season_rank") as SortKey;
  const order = (sp.get("order") ?? "asc") as SortOrder;
  const page = Number(sp.get("page") ?? 1);
  const limit = Number(sp.get("limit") ?? 20);

  const [searchInput, setSearchInput] = useState<string>(search);
  // const [sort, setSort] = useState<SortKey>("season_rank");
  // const [order, setOrder] = useState<SortOrder>("asc");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { setPage, onPrev, onNext, resetPage, onLimitChange, buildFlags } = usePagination({
    initialLimit: 20,
  });
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 250);
  const { rows, meta, loading, refetch } = useLeaderboard({
    season: SEASON,
    page,
    limit,
    sort,
    order,
    search: debouncedSearch,
  });

  const setParams = (next: Record<string, string>, replace = false) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(next).forEach(([k, v]) => params.set(k, v));
    const url = `?${params.toString()}`;
    replace ? router.replace(url) : router.push(url);
  };

  const handleSortChange = (next: SortKey) => {
    const nextOrder = sort === next ? (order === "asc" ? "desc" : "asc") : "asc";
    setParams({ sort: next, order: nextOrder, page: "1" });
  };

  const handlePlayerSubmit = async (values: PlayerFormValues) => {
    const payload = toPlayerPayload(values);

    if (modalMode === "create") {
      await apiPost("/players", payload);
      setParams({ page: "1" });
    } else {
      if (!selectedId) return;
      await apiPut(`/players/${selectedId}`, payload);
    }

    setModalOpen(false);
    await refetch();
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    await apiDelete(`/players/${selectedId}`);

    setDeleteOpen(false);
    await refetch();
    setSelectedId(null);
  };

  const exportCsv = useCallback(
    () => exportLeaderboardCsv({ season: SEASON, sort, order, search: debouncedSearch }),
    [sort, order, debouncedSearch]
  );

  const rowsById = useMemo(() => new Map(rows.map((r) => [r.id, r])), [rows]);

  const selected = useMemo(() => {
    if (selectedId == null) return null;
    return rowsById.get(selectedId) ?? null;
  }, [rowsById, selectedId]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch === search) return; // important guard
    setParams({ search: debouncedSearch, page: "1" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    if (rows.length === 0) {
      setSelectedId(null);
      return;
    }

    setSelectedId((prev) => (prev && rows.some((r) => r.id === prev) ? prev : rows[0].id));
  }, [rows]);


  const canPrev = !loading && page > 1;
  const canNext = !loading && (meta ? page < meta.last_page : rows.length === limit);
  return (
    <ScoreboardLayout
      hero={<TopScoreboard />}
      top={
        <TopBar
          search={searchInput}
          onSearchChange={setSearchInput}
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
        page={page}
        limit={limit}
        onPrev={() => setParams({ page: String(page - 1) })}
        onNext={() => setParams({ page: String(page + 1) })}
        onLimitChange={(newLimit) => setParams({ limit: String(newLimit), page: "1" })}
        loading={loading}
        meta={meta}
        // page={page}
        canPrev={canPrev}
        canNext={canNext}
        // onPrev={onPrev}
        // onNext={onNext}
        // onLimitChange={onLimitChange}
        // limit={limit}
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
