import clsx from "clsx";
import type { SortKey, SortOrder } from "../../types";

type HeaderCellProps =
  | { label: string; sortKey?: undefined }
  | {
      label: string;
      sortKey: SortKey;
      activeSort: SortKey;
      order: SortOrder;
      onSortChange: (k: SortKey) => void;
    };

const SortIcon = ({ active, order }: { active: boolean; order: SortOrder }) =>{
  const upOpacity = active && order === "desc" ? 0.35 : 1;
  const downOpacity = active && order === "asc" ? 0.35 : 1;

  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
      <path d="M5 0L9 4H1L5 0Z" fill="#FFFFFF" opacity={upOpacity} />
      <path d="M5 14L1 10H9L5 14Z" fill="#FFFFFF" opacity={downOpacity} />
    </svg>
  );
}

export const HeaderCell = (props: HeaderCellProps) => {
  const { label } = props;

  const labelEl = (
    <span className="text-[11px] font-extrabold tracking-[0.22em] uppercase text-[#F7E37A]">
      {label}
    </span>
  );

  if (props.sortKey == null) {
    return <div className="h-14 flex items-center px-3 border-r border-white/10">{labelEl}</div>;
  }

  const { sortKey, activeSort, order, onSortChange } = props;
  const isActive = activeSort === sortKey;

  return (
    <button
      type="button"
      onClick={() => onSortChange(sortKey)}
      aria-sort={isActive ? (order === "asc" ? "ascending" : "descending") : "none"}
      className={clsx(
        "h-14 flex items-center px-3 border-r border-white/10 text-left",
        "hover:bg-white/10",
        isActive && "bg-white/10"
      )}
    >
      {labelEl}
      <span className="ml-2 opacity-90">
        <SortIcon active={isActive} order={order} />
      </span>
    </button>
  );
};
