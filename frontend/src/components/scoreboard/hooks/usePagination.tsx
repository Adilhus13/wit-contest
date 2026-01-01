import { useCallback, useMemo, useState } from "react";
import type { PaginatorMeta } from "../types";

type Options = {
  initialPage?: number;
  initialLimit?: number;
};

export const usePagination = ({ initialPage = 1, initialLimit = 10 }: Options = {}) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const resetPage = useCallback(() => setPage(1), []);

  const onPrev = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);

  const onNext = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const onLimitChange = useCallback((newLimit: number) => {
    setPage(1);
    setLimit(newLimit);
  }, []);

  const buildFlags = useCallback(
    (meta: PaginatorMeta | null, loading: boolean, currentRowsCount: number) => ({
      canPrev: !loading && page > 1,
      canNext: !loading && (meta ? page < meta.last_page : currentRowsCount === limit),
    }),
    [page, limit]
  );

  return useMemo(
    () => ({
      page,
      limit,
      setPage,  
      resetPage,   
      onPrev,
      onNext,
      onLimitChange,
      buildFlags,
    }),
    [page, limit, setPage, resetPage, onPrev, onNext, onLimitChange, buildFlags]
  );
};
