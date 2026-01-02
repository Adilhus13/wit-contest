import { apiGet } from "@/components/scoreboard/api";
import { useEffect, useState } from "react";
import { GameDto } from "../../types";
import { GameCard } from "./GameCard";

const GAMES_LIMIT = 12;

export const TopScoreboard = () => {
  const [games, setGames] = useState<GameDto[]>([]);
  
  useEffect(() => {
    const getGamesList = async () => {
      const res = await apiGet<{ data: GameDto[] }>(`/games?limit=${GAMES_LIMIT}`)
      setGames(res.data);
    }
    getGamesList()
  }, [])

  return (
    <section className="h-full bg-[linear-gradient(180deg,#C00000_0%,#6B0000_70%)]">
      <div className="pt-10">
        <div className="flex items-center justify-between text-white mx-100">
          <div className="flex text-4xl">
            <img src="49ers-logo.png" />
            <p className="mt-2 ml-2">San Francisco 49ers</p>
          </div>
          <div>
            <p>2023 - 2024 SEASON</p>
          </div>
        </div>
        <p className="rounded-xl p-[0.5px] bg-linear-to-r from-neutral-400 via-gray-300 to-neutral-400 w-full mt-10"></p>
      </div>
      <div className="h-100 px-8 pb-6 flex items-center">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </section>
  );
}
