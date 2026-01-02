import { useQuery } from "@tanstack/react-query";
import { apiGet, getToken } from "@/components/scoreboard/api";
import { useEffect, useState } from "react";
import { GameDto } from "../../types";
import { GameCard } from "./GameCard";
import { Spinner } from "../common/Spinner";

const GAMES_LIMIT = 12;

type GamesResponse = GameDto[] | { data: GameDto[] };

const normalizeGames = (res: GamesResponse): GameDto[] => {
  if (Array.isArray(res)) return res;
  return res.data ?? [];
}

export const TopScoreboard = () => {
  const gamesQuery = useQuery({
    queryKey: ["games", { limit: GAMES_LIMIT }],
    queryFn: async () => {
      const res = await apiGet<GamesResponse>("/games?limit=12");
      return normalizeGames(res);
    },
  });

  const games = gamesQuery.data ?? [];

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
          {gamesQuery.isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <Spinner size="md" label="Loading games" />
          </div>
          ) : (
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
        </div>
        )}
      </div>
    </section>
  );
}
