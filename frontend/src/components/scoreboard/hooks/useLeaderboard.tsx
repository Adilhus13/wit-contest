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
   /**
   * TanStack Query client lets us manually invalidate cached queries
   * after mutations (create/update/delete) so the leaderboard refetches.
   */
  const queryClient = useQueryClient();

  /**
   * CREATE
   * - Sends POST /players
   * - On success, invalidate the leaderboard query so UI refreshes with new player.
   * - Uses mutateAsync so callers can await the operation and close modals, etc.
   */
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

  /**
   * UPDATE
   * - Sends PUT /players/:id
   * - On success, invalidate the leaderboard query so UI reflects changes.
   */

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

  /**
   * DELETE
   * - Sends DELETE /players/:id
   * - On success, invalidate the leaderboard query so UI removes the player.
   */

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

  /**
   * READ (Leaderboard Query)
   * - Query key includes pagination + sorting + search so caching works correctly
   *   and each combination is treated as a separate cached result.
   * - debouncedSearch avoids refetching on every keystroke.
   */
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
