"use client";

import clsx from "clsx";
import { SortKey, SortOrder } from "./DashboardPage";

export type LeaderboardRow = {
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

type Props = {
  rows: LeaderboardRow[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  
  sort: SortKey;
  order: SortOrder;
  onSortChange: (key: SortKey) => void;
};


export default function LeaderboardTable({
  rows,
  selectedId,
  onSelect,
  sort,
  order,
  onSortChange,
}: Props) {
  return (
    <div className="border border-[#C00000]/70">
      {/* header */}
      <div className="grid grid-cols-[98px_96px_56px_140px_140px_68px_62px_62px_68px_68px_220px_1fr] bg-[linear-gradient(180deg,#6B0000_0%,#3E0000_100%)]">
        <HeaderCell
          label="SEASON RANK"

        />
        <HeaderCell
          label="GAME RANK"

        />
        <HeaderCell label="#"
          sortKey="jersey_number"
          activeSort={sort}
          order={order}
          onSortChange={onSortChange}
        />
        <HeaderCell
          label="FIRST NAME"
          sortKey="first_name"
          activeSort={sort}
          order={order}
          onSortChange={onSortChange}
        />
        <HeaderCell
          label="LAST NAME"
          sortKey="last_name"
          activeSort={sort}
          order={order}
          onSortChange={onSortChange}
        />
        <HeaderCell label="POS"
          sortKey="position"
          activeSort={sort}
          order={order}
          onSortChange={onSortChange}
        />
        <HeaderCell label="HT"
          sortKey="height_in"
          activeSort={sort}
          order={order}
          onSortChange={onSortChange}
        />
        <HeaderCell label="WT"
          sortKey="weight_lb"
          activeSort={sort}
          order={order}
          onSortChange={onSortChange}
        />
        <HeaderCell label="AGE"
          sortKey="age"
          activeSort={sort}
          order={order}
          onSortChange={onSortChange}
        />
        <HeaderCell label="EXP"
          sortKey="experience_years"
          activeSort={sort}
          order={order}
          onSortChange={onSortChange}
        />
        <HeaderCell label="COLLEGE"
          sortKey="college"
          activeSort={sort}
          order={order}
          onSortChange={onSortChange}
        />
        <div className="h-14" />
      </div>

      <div className="bg-white h-full max-h-screen overflow-y-scroll">
        {rows.map((r) => {
          const selected = selectedId !== null && r.id === selectedId;

          return (
            <button
              key={r.id}
              type="button"
              onClick={() => r.id === selectedId ? onSelect(null) : onSelect(r.id)} // ✅ no deselect-on-click
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

function HeaderCell({
  label,
  sortKey,
  activeSort,
  order,
  onSortChange,
}: {
  label: string;
  sortKey?: SortKey;
  activeSort?: SortKey;
  order?: SortOrder;
  onSortChange?: (key: SortKey) => void;
}) {
  const sortable = !!sortKey && !!onSortChange;
  const isActive = sortable && activeSort === sortKey;

  const content = (
    <>
      <span className="text-[11px] font-extrabold tracking-[0.22em] uppercase text-[#F7E37A]">
        {label}
      </span>
      <span className="ml-2 opacity-90">
        <SortIcon active={!!isActive} order={order ?? "asc"} />
      </span>
    </>
  );

  if (!sortable) {
    return <div className="h-14 flex items-center px-3 border-r border-white/10">{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={() => onSortChange!(sortKey!)}
      className={clsx(
        "h-14 flex items-center px-3 border-r border-white/10 text-left",
        "hover:bg-white/10",
        isActive && "bg-white/10"
      )}
    >
      {content}
    </button>
  );
}

function SortIcon({ active, order }: { active: boolean; order: SortOrder }) {
  const upOpacity = active && order === "desc" ? 0.35 : 1;
  const downOpacity = active && order === "asc" ? 0.35 : 1;

  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
      <path d="M5 0L9 4H1L5 0Z" fill="#FFFFFF" opacity={upOpacity} />
      <path d="M5 14L1 10H9L5 14Z" fill="#FFFFFF" opacity={downOpacity} />
    </svg>
  );
}
