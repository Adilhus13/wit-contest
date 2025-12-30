"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import { mockWeeklyBars } from "@/lib/mockData";

export default function RankingChartCard({
  ranking,
  seasonLabel,
}: {
  ranking: number;
  seasonLabel: string;
}) {
  return (
    <div className="bg-[linear-gradient(180deg,#C00000_0%,#6B0000_100%)] px-6 py-5 text-white relative">
      <div className="flex items-start justify-between">
        <div className="text-[12px] font-extrabold tracking-[0.18em] uppercase leading-[1.15]">
          {seasonLabel.split(" ").slice(0, 2).join(" ")}
          <br />
          {seasonLabel.split(" ").slice(2).join(" ")}
        </div>

        <div className="text-[18px] font-light tracking-[0.08em]">
          RANKING: <span className="font-extrabold">{ranking}</span>
        </div>
      </div>

            <div className="mt-6 h-43.75 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockWeeklyBars} barCategoryGap={6}>
            <XAxis dataKey="week" hide />
            <Bar dataKey="value" fill="#F7E37A" radius={[2, 2, 0, 0]} barSize={10} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="absolute right-4 bottom-4 rotate-90 text-[10px] font-extrabold tracking-[0.22em] opacity-95">
        WK 16
      </div>
    </div>
  );
}
