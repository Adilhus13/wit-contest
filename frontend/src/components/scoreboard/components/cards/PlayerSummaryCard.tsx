import { UIPlayerRow } from "../../types";

type PlayerSummaryCardProps = { player: UIPlayerRow };

export const PlayerSummaryCard = ({ player }: PlayerSummaryCardProps) => {
  const src = player.headshotUrl || "/placeholder-headshot.png";
  return (
    <div className="flex items-center gap-4">
      <div className="h-18.5 w-18.5 rounded-2xl bg-[linear-gradient(180deg,#C00000_0%,#6B0000_100%)] shadow-[0_14px_26px_rgba(0,0,0,0.22)] flex items-center justify-center text-[#F7E37A] font-extrabold">
        <img
          src={src}
          alt={`${player.firstName} ${player.lastName}`.trim()}
          className="h-17.5 w-17.5 rounded-2xl object-cover"
        />
      </div>

      <div>
        <div className="text-[22px] leading-[1.05]">
          <div className="font-light text-black">{player.firstName}</div>
          <div className="font-extrabold text-black">{player.lastName}</div>
        </div>

        <div className="mt-1 text-[11px] font-extrabold tracking-[0.22em] text-black/70 uppercase">
          #{player.jersey} &nbsp;&nbsp; {player.pos || "—"}
        </div>
      </div>
    </div>
  );
}
