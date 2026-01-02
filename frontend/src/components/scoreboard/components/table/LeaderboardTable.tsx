"use client";
import clsx from "clsx";
import { LeaderboardRow, SortKey, SortOrder } from "../../types";
import { HeaderCell } from "./HeaderCell";
import { columns } from "./columns";
import { useCallback } from "react";

type LeaderboardTableProps = {
  rows: LeaderboardRow[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  sort: SortKey;
  order: SortOrder;
  onSortChange: (key: SortKey) => void;
};

export const LeaderboardTable = ({
  rows,
  selectedId,
  onSelect,
  sort,
  order,
  onSortChange,
}: LeaderboardTableProps) => {

  const handleRowClick = useCallback(
  (id: number) => onSelect(id === selectedId ? null : id),
  [onSelect, selectedId]
);


  return (
    <div className="border border-[#C00000]/70">
      <div className="grid grid-cols-[98px_96px_56px_140px_140px_68px_62px_62px_68px_68px_220px_1fr] bg-[linear-gradient(180deg,#6B0000_0%,#3E0000_100%)]">
        {columns.map((c) =>
          "sortKey" in c ? (
            <HeaderCell
              key={c.label}
              label={c.label}
              sortKey={c.sortKey}
              activeSort={sort}
              order={order}
              onSortChange={onSortChange}
            />
          ) : (
            <HeaderCell key={c.label} label={c.label} />
          )
        )}
        <div className="h-14" />
      </div>

      <div className="bg-white h-full max-h-screen overflow-y-scroll">
        {rows.map((r) => {
          const selected = selectedId !== null && r.id === selectedId;

          return (
            <button
              role="row"
              aria-selected={selected}
              key={r.id}
              type="button"
              onClick={() => handleRowClick(r.id)}
              className={clsx(
                "w-full text-left grid grid-cols-[98px_96px_56px_140px_140px_68px_62px_62px_68px_68px_220px_1fr] items-center",
                "text-[13px] text-black/80",
                "border-t border-black/10",
                selected && "bg-[#F6E6E6] border-y-2 border-[#C00000]"
              )}
            >
              <div className="h-full py-4 flex items-center justify-center font-extrabold bg-[#4A4A4A] text-[#F7E37A]">
                {r.seasonRank}
              </div>
              <div className="py-4 flex items-center justify-center font-extrabold text-black">
                {r.gameRank}
              </div>
              <div className="py-4 flex items-center justify-center">{r.jersey}</div>
              <div className="py-4 px-4">{r.firstName}</div>
              <div className="py-4 px-4">{r.lastName}</div>
              <div className="py-4 flex items-center justify-center">{r.pos}</div>
              <div className="py-4 flex items-center justify-center">{r.ht}</div>
              <div className="py-4 flex items-center justify-center">{r.wt}</div>
              <div className="py-4 flex items-center justify-center">{r.age}</div>
              <div className="py-4 flex items-center justify-center">{r.exp}</div>
              <div className="py-4 px-4">{r.college}</div>
              <div className="py-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}


