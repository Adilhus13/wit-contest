import React from "react";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;

  canEdit: boolean;
  canDelete: boolean;

  onExport: () => void;
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export const TopBar = ({
  search,
  onSearchChange,
  canEdit,
  canDelete,
  onExport,
  onAdd,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div className="bg-white border-b border-black/10">
      <div className="px-6 py-4 relative flex items-center gap-4">
        <div className="inline-flex items-center gap-3 rounded-lg bg-white border-[3px] border-[#C00000] shadow-[0_10px_18px_rgba(0,0,0,0.12)] px-3">
          <div className="h-9 w-9 rounded-md flex items-center justify-center">
            <svg width="18" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 5h18l-7 8v5l-4 1v-6L3 5z" fill="#B3995D" />
            </svg>
          </div>
          <div className="text-[14px] font-extrabold tracking-[0.22em] text-[#B3995D] uppercase">
            FILTER
          </div>
        </div>

        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="SEARCH"
          className="h-8.5 w-70 rounded-md border border-black/20 px-4 text-sm outline-none placeholder:text-black/30"
        />

        <button
          type="button"
          onClick={onExport}
          className="text-[14px] font-semibold tracking-[0.28em] text-[#C00000] uppercase hover:opacity-80"
        >
          EXPORT DATA
        </button>

        <button
          type="button"
          onClick={onAdd}
          className="ml-auto h-9 px-4 rounded-md bg-[#C00000] text-white text-sm font-extrabold tracking-[0.16em] uppercase"
        >
          ADD PLAYER
        </button>

        <button
          type="button"
          disabled={!canEdit}
          onClick={onEdit}
          className={`h-9 px-4 rounded-md text-sm font-extrabold tracking-[0.16em] uppercase ${
            canEdit ? "bg-[#B3995D] text-black hover:bg-[#A88C4F]" : "bg-black/10 text-black/30"
          }`}
        >
          EDIT PLAYER
        </button>

        <button
          type="button"
          disabled={!canDelete}
          onClick={onDelete}
          className={`h-9 px-4 rounded-md text-sm font-extrabold tracking-[0.16em] uppercase ${
            canDelete ? "bg-black text-white hover:bg-black/85" : "bg-black/10 text-black/30"
          }`}
        >
          DELETE
        </button>
      </div>
    </div>
  );
}
