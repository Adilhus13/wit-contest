import { apiGet, getToken } from "@/components/scoreboard/api";
import { useEffect, useState } from "react";

type GameDto = {
  id: number;
  season?: number | null;
  date: string;
  stadium: string | null;
  opponentCity: string | null;
  opponentName: string | null;
  result: "W" | "L";
  score: string;
  logo_url: string;
};


export default function TopScoreboard() {

  const [games, setGames] = useState<GameDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
   let cancelled = false;
   
   (async () => {
    try {
      const token = await getToken();
      const res = await apiGet<{data: GameDto[] }>(`/games?limit=12`, token)
      if(!cancelled) setGames(res.data);
    }catch (e) {
      console.error(e);
      if(!cancelled) setGames([])
    } finally {
      if(!cancelled) setLoading(false);
    }
   })();

   return () => {
    cancelled = true
   }
  }, [])

  if (loading) return <section className="h-full bg-[linear-gradient(180deg,#C00000_0%,#6B0000_70%)]" />;

  return (
    <section className="h-full bg-[linear-gradient(180deg,#C00000_0%,#6B0000_70%)]">
      <div className="pt-10">
      <div className="flex items-center justify-between text-white mx-100">
        <div className="flex text-4xl">
          <img src="49ers-logo.png"/>
          <p className="mt-2 ml-2">San Fransisco 49ers</p>
        </div>
        <div>
          <p>2023 - 2024 SEASON</p>
        </div>
      </div>
        <p className="rounded-xl p-[0.5px] bg-linear-to-r from-neutral-400 via-gray-300 to-neutral-400 w-full mt-10"></p>
      </div>
      <div className="h-100 px-8 pb-6 flex items-center">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {games.map((g, idx) => {
            const bg = "bg-[#B3995D]";
            return (
              <div
                key={idx}
                className={[
                  "w-42.5 shrink-0 rounded-2xl",
                  "shadow-[0_14px_28px_rgba(0,0,0,0.26)]",
                  bg,
                  "h-57.5",
                  "px-6 py-5",
                  "flex flex-col justify-between text-center",
                ].join(" ")}
              >
                <div>
                  <div className="text-[10px] font-extrabold tracking-[0.22em] text-black/80 uppercase">
                    {g.date}
                  </div>
                  <div className="mt-1 text-[10px] font-extrabold tracking-[0.22em] text-black/70 uppercase">
                    {g.stadium}
                  </div>
                </div>

                
                <div className="flex w-full align-center justify-center"><img src={g.logo_url} /></div>

                <div>
                  <div className="text-[12px] font-semibold text-black/70 uppercase">VS</div>
                  <div className="mt-2 text-[13px] font-extrabold tracking-[0.08em] text-black uppercase">
                    {g.opponentCity}
                  </div>
                  <div className="text-[16px] font-black tracking-[0.08em] text-black uppercase">
                    {g.opponentName}
                  </div>
                </div>

                <div className="text-[14px] font-black tracking-[0.14em] text-black uppercase">
                  {g.result} {g.score}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
