import clsx from "clsx";
import { LeaderboardRow, SortKey, SortOrder } from "../../types";
import { HeaderCell } from "./HeaderCell";
import { columns } from "./columns";
import { useCallback } from "react";
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

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

  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

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
      <div
        ref={parentRef}
        className="bg-white h-full max-h-screen overflow-y-auto"
      >
        <div style={{ height: totalSize, position: "relative" }}>
          {virtualRows.map((vr) => {
            const r = rows[vr.index];
            const selected = selectedId !== null && r.id === selectedId;

            return (
              <button
                key={r.id}
                type="button"
                aria-selected={selected}
                onClick={() => handleRowClick(r.id)}
                className={clsx(
                  "w-full text-left grid grid-cols-[98px_96px_56px_140px_140px_68px_62px_62px_68px_68px_220px_1fr] items-center",
                  "text-[13px] text-black/80",
                  "border-t border-black/10",
                  selected && "bg-[#F6E6E6] border-y-2 border-[#C00000]"
                )}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${vr.start}px)`,
                }}
              >
                {/* your cells exactly as before */}
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

    </div>
  );
}


