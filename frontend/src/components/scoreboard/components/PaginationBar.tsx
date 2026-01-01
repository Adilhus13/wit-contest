import React from "react";
import type { PaginatorMeta } from "../types";

type Props = {
  loading: boolean;
  meta: PaginatorMeta | null;
  page: number;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;

  limit: number;
  onLimitChange: (limit: number) => void;

  fallbackCount: number;
};

export const PaginationBar = ({
  loading,
  meta,
  page,
  canPrev,
  canNext,
  onPrev,
  onNext,
  limit,
  onLimitChange,
  fallbackCount,
}: Props) =>{
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-sm text-black/60">
        {meta ? (
          <>
            Showing <span className="font-semibold text-black/80">{meta.from ?? "-"}</span>–
            <span className="font-semibold text-black/80">{meta.to ?? "-"}</span> of{" "}
            <span className="font-semibold text-black/80">{meta.total}</span>
          </>
        ) : (
          <span>{loading ? "Loading…" : `Showing ${fallbackCount} rows`}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-black/60">ROWS</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
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
          onClick={onPrev}
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
          onClick={onNext}
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
  );
}
