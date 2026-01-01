import { useCallback, useEffect, useState } from "react";
import type { LeaderboardResponse, PaginatorMeta, SortKey, SortOrder, UiPlayerRow } from "../types";
import { apiGet, getToken } from "../api"; // adjust path
import { mapRow } from "../mappers";

type Params = {
  season: number;
  page: number;
  limit: number;
  sort: SortKey;
  order: SortOrder;
  search: string;
};

export const useLeaderboard = (params: Params) => {
  const [rows, setRows] = useState<UiPlayerRow[]>([]);
  const [meta, setMeta] = useState<PaginatorMeta | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();

      const qs = new URLSearchParams({
        season: String(params.season),
        limit: String(params.limit),
        page: String(params.page),
        sort: params.sort,
        order: params.order,
      });

      if (params.search) qs.set("search", params.search);

      const res = await apiGet<LeaderboardResponse>(`/leaderboard?${qs.toString()}`, token);

      setRows(res.data.map(mapRow));
      setMeta(res.meta ?? null);
    } catch (e) {
      console.error(e);
      setRows([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [params.season, params.limit, params.page, params.sort, params.order, params.search]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { rows, meta, loading, refetch };
}
