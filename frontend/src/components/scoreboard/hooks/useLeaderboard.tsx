import { useCallback, useEffect, useMemo, useState } from "react";
import type { LeaderboardResponse, PaginatorMeta, SortKey, SortOrder, UIPlayerRow } from "../types";
import { apiDelete, apiGet, apiPost, apiPut } from "../api";
import { mapRow } from "../mappers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { showToast } from "../components/common/Toast";

type Params = {
  season: number;
  page: number;
  limit: number;
  sort: SortKey;
  order: SortOrder;
  debouncedSearch: string;
};

export const useLeaderboard = ({ season, limit, page, sort, order,  debouncedSearch }: Params) => {
  
  const queryClient = useQueryClient();

  const {
    mutateAsync: createPlayer,
    isPending: createLoading,
  } = useMutation({
    mutationFn: async (payload: any) => {
      return apiPost("/players", payload);
    },
    onSuccess: async () => {
      showToast({ message: "Player created successfully!", severity: "success" });
      await queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
    onError: (e: any) => {
      showToast({
        message: "Error: Player creation failed",
        severity: "error",
      });
    },
  });

  const {
    mutateAsync: updatePlayer,
    isPending: updateLoading,
  } = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      return apiPut(`/players/${id}`, payload);
    },
    onSuccess: async () => {
      showToast({ message: "Player updated successfully!", severity: "success" });
      await queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
    onError: (e: any) => {
      showToast({
        message: "Error: Player update failed",
        severity: "error",
      });
    },
  });

  const {
    mutateAsync: deletePlayer,
    isPending: deleteLoading,
  } = useMutation({
    mutationFn: async (id: number) => {
      return apiDelete(`/players/${id}`);
    },
    onSuccess: async () => {
      showToast({ message: "Player deleted successfully!", severity: "success" });
      await queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
    onError: (e: any) => {
      showToast({
        message: `Error: Player not deleted: ${e?.message}`,
        severity: "error",
      });
    },
  });
  
  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery({
    queryKey: ["leaderboard", { season, limit, page, sort, order, debouncedSearch }],
    queryFn: async () => {
      const qs = new URLSearchParams({
        season: String(season),
        limit: String(limit),
        page: String(page),
        sort,
        order,
      });
      if (debouncedSearch) qs.set("search", debouncedSearch);

      return apiGet<LeaderboardResponse>(`/leaderboard?${qs.toString()}`);
      },
  });



  return { createPlayer, createLoading, updatePlayer ,updateLoading, deletePlayer, deleteLoading, leaderboardData, leaderboardLoading };
};
