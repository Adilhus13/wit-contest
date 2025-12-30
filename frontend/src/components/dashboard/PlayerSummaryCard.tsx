import type { PlayerRow } from "@/lib/mockData";

export default function PlayerSummaryCard({ player }: { player: PlayerRow }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-[74px] w-[74px] rounded-2xl bg-[linear-gradient(180deg,#C00000_0%,#6B0000_100%)] shadow-[0_14px_26px_rgba(0,0,0,0.22)] flex items-center justify-center text-[#F7E37A] font-extrabold">
        49
      </div>

      <div>
        <div className="text-[22px] leading-[1.05]">
          <div className="font-light text-black">{player.firstName}</div>
          <div className="font-extrabold text-black">{player.lastName}</div>
        </div>

        <div className="mt-1 text-[11px] font-extrabold tracking-[0.22em] text-black/70 uppercase">
          #{player.jersey} &nbsp;&nbsp; OFFENSIVE TACKLE
        </div>
      </div>
    </div>
  );
}
