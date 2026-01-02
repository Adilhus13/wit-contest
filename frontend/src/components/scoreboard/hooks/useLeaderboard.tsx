import { useCallback, useEffect, useState } from "react";
import type { LeaderboardResponse, PaginatorMeta, SortKey, SortOrder, UIPlayerRow } from "../types";
import { apiGet } from "../api";
import { mapRow } from "../mappers";

type Params = {
  season: number;
  page: number;
  limit: number;
  sort: SortKey;
  order: SortOrder;
  search: string;
};

export const useLeaderboard = ({ season, limit, page, sort, order, search }: Params) => {
  const [rows, setRows] = useState<UIPlayerRow[]>([]);
  const [meta, setMeta] = useState<PaginatorMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {

      const qs = new URLSearchParams({
        season: String(season),
        limit: String(limit),
        page: String(page),
        sort,
        order,
      });

      if (search) qs.set("search", search);

      const res = await apiGet<LeaderboardResponse>(`/leaderboard?${qs.toString()}`);

      setRows(res.data.map(mapRow));
      setMeta(res.meta ?? null);
    } catch (e) {
      console.error(e);
      setRows([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [season, limit, page, sort, order, search]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { rows, meta, loading, refetch };
};
