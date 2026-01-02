import type { UIPlayerRow } from "../../types";
import { RankingChartCard } from "./RankingChartCard";
import { PlayerSummaryCard } from "./PlayerSummaryCard";

type RightPanelProps = { selected: UIPlayerRow };

export const RightPanel =({ selected }: RightPanelProps) => {
  return (
    <div className="rounded-2xl bg-white shadow-[0_18px_35px_rgba(0,0,0,0.22)] overflow-hidden">
      <RankingChartCard ranking={selected.gameRank} seasonLabel="2023-2024 SEASON" />
      <div className="px-6 py-5">
        <PlayerSummaryCard player={selected} />
      </div>
    </div>
  );
}