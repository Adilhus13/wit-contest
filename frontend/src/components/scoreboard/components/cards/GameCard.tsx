import type { GameDto } from "../../types";

export const GameCard = ({ game }: { game: GameDto }) => {
  return (
    <div
      className={[
        "w-42.5 shrink-0 rounded-2xl",
        "shadow-[0_14px_28px_rgba(0,0,0,0.26)]",
        "bg-[#B3995D]",
        "h-57.5",
        "px-6 py-5",
        "flex flex-col justify-between text-center",
      ].join(" ")}
    >
      <div>
        <div className="text-[10px] font-extrabold tracking-[0.22em] text-black/80 uppercase">
          {game.date}
        </div>
        <div className="mt-1 text-[10px] font-extrabold tracking-[0.22em] text-black/70 uppercase">
          {game.stadium}
        </div>
      </div>

      <div className="flex w-full items-center justify-center">
        <img src={game.logo_url} alt={`${game.opponentName ?? "Opponent"} logo`} />
      </div>

      <div>
        <div className="text-[12px] font-semibold text-black/70 uppercase">VS</div>
        <div className="mt-2 text-[13px] font-extrabold tracking-[0.08em] text-black uppercase">
          {game.opponentCity}
        </div>
        <div className="text-[16px] font-black tracking-[0.08em] text-black uppercase">
          {game.opponentName}
        </div>
      </div>

      <div className="text-[14px] font-black tracking-[0.14em] text-black uppercase">
        {game.result} {game.score}
      </div>
    </div>
  );
};
