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
        "font-['Open_sans',system-ui,sans-serif]"
      ].join(" ")}
    >
      <div>
        <div className="text-[11px] uppercase">
          {game.date}
        </div>
        <div className="text-[11px] font-bold uppercase">
          {game.stadium}
        </div>
      </div>

      <div className="flex w-full items-center justify-center">
        <img src={game.logoUrl} alt={`${game.opponentName ?? "Opponent"} logo`} />
      </div>

      <div>
        <div className="text-[12px] font-bold uppercase">VS</div>
        <div className="mt-2 text-[16px] uppercase">
          {game.opponentCity}
        </div>
        <div className="text-[16px] font-black text-black uppercase">
          {game.opponentName}
        </div>
      </div>

      <div className="text-[14px] tracking-[0.14em] uppercase">
        <strong>{game.result}</strong> {game.score}
      </div>
    </div>
  );
};
