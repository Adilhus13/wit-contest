import type { PlayerRow } from "@/lib/mockData";
import RankingChartCard from "./RankingChartCard";
import PlayerSummaryCard from "./PlayerSummaryCard";

export default function RightPanel({ selected }: { selected: PlayerRow }) {
  return (
    <div className="rounded-2xl bg-white shadow-[0_18px_35px_rgba(0,0,0,0.22)] overflow-hidden">
      <RankingChartCard ranking={selected.gameRank} seasonLabel="2023-2024 SEASON" />
      <div className="px-6 py-5">
        <PlayerSummaryCard player={selected} />
      </div>
    </div>
  );
}
