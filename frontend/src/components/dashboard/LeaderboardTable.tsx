"use client";

import clsx from "clsx";

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
};

export default function LeaderboardTable({ rows, selectedId, onSelect }: Props) {
  return (
    <div className="border border-[#C00000]/70">
      {/* header */}
      <div className="grid grid-cols-[98px_96px_56px_140px_140px_68px_62px_62px_68px_68px_220px_1fr] bg-[linear-gradient(180deg,#6B0000_0%,#3E0000_100%)]">
        <HeaderCell label="SEASON RANK" />
        <HeaderCell label="GAME RANK" />
        <HeaderCell label="#" />
        <HeaderCell label="FIRST NAME" />
        <HeaderCell label="LAST NAME" />
        <HeaderCell label="POS" />
        <HeaderCell label="HT" />
        <HeaderCell label="WT" />
        <HeaderCell label="AGE" />
        <HeaderCell label="EXP" />
        <HeaderCell label="COLLEGE" />
        <div className="h-14" />
      </div>

      <div className="bg-white h-screen overflow-y-scroll">
        {rows.map((r, idx) => {
          const selected = selectedId !== null && r.id === selectedId;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => r.id === selectedId ? onSelect(null) : onSelect(r.id)}
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

function HeaderCell({ label }: { label: string }) {
  return (
    <div className="h-14 flex items-center px-3 border-r border-white/10">
      <span className="text-[11px] font-extrabold tracking-[0.22em] uppercase text-[#F7E37A]">
        {label}
      </span>
      <span className="ml-2 opacity-90">
        <SortIcon />
      </span>
    </div>
  );
}

function SortIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
      <path d="M5 0L9 4H1L5 0Z" fill="#FFFFFF" />
      <path d="M5 14L1 10H9L5 14Z" fill="#FFFFFF" />
    </svg>
  );
}
