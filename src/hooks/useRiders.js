import { useCallback, useState } from "react";
import { api } from "../lib/apiClient";
import { useAsync } from "./useAsync";

// GET /api/v1/riders?q&account_status&rider_type&limit&offset -> { items, count }
// The API does not expose a verified=true/false query parameter. For the
// "Unverified" UI filter we therefore fetch the complete matching rider set,
// filter by `verified`, and paginate the filtered result locally. This avoids
// the previous bug where only the current server page was filtered.
export function useRiders({ search, status, limit = 10 } = {}) {
  const [offset, setOffset] = useState(0);

  const accountStatus =
    status === "Active" ? "active" : status === "Suspended" ? "suspended" : undefined;
  const unverified = status === "Unverified";

  const { data, loading, error, refetch } = useAsync(
    async () => {
      if (!unverified) {
        return api.get("/api/v1/riders", {
          q: search || undefined,
          account_status: accountStatus,
          limit,
          offset,
        });
      }

      const pageSize = 100;
      const first = await api.get("/api/v1/riders", {
        q: search || undefined,
        limit: pageSize,
        offset: 0,
      });

      const all = [...(first?.items ?? [])];
      const total = first?.count ?? all.length;
      const remainingOffsets = [];
      for (let nextOffset = pageSize; nextOffset < total; nextOffset += pageSize) {
        remainingOffsets.push(nextOffset);
      }

      if (remainingOffsets.length) {
        const pages = await Promise.all(
          remainingOffsets.map((nextOffset) =>
            api.get("/api/v1/riders", {
              q: search || undefined,
              limit: pageSize,
              offset: nextOffset,
            })
          )
        );
        pages.forEach((page) => all.push(...(page?.items ?? [])));
      }

      const filtered = all.filter((rider) => !rider.verified);
      return {
        items: filtered.slice(offset, offset + limit),
        count: filtered.length,
      };
    },
    [search, accountStatus, limit, offset, unverified]
  );

  const items = data?.items ?? [];
  const count = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(count / limit));

  return {
    riders: items,
    count,
    pageCount,
    page: Math.floor(offset / limit) + 1,
    loading,
    error,
    refetch,
    resetPage: useCallback(() => setOffset(0), []),
    nextPage: useCallback(
      () => setOffset((o) => Math.min(o + limit, (pageCount - 1) * limit)),
      [limit, pageCount]
    ),
    prevPage: useCallback(() => setOffset((o) => Math.max(o - limit, 0)), [limit]),
  };
}

export function useRiderActions() {
  const [submitting, setSubmitting] = useState(false);

  const flag = useCallback(async (riderId, reason) => {
    setSubmitting(true);
    try {
      return await api.post(`/api/v1/riders/${riderId}/flag`, { reason });
    } finally {
      setSubmitting(false);
    }
  }, []);

  const unflag = useCallback(async (riderId) => {
    setSubmitting(true);
    try {
      return await api.post(`/api/v1/riders/${riderId}/unflag`);
    } finally {
      setSubmitting(false);
    }
  }, []);

  const suspend = useCallback(async (riderId) => {
    setSubmitting(true);
    try {
      return await api.post(`/api/v1/riders/${riderId}/suspend`);
    } finally {
      setSubmitting(false);
    }
  }, []);

  const activate = useCallback(async (riderId) => {
    setSubmitting(true);
    try {
      return await api.post(`/api/v1/riders/${riderId}/activate`);
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { flag, unflag, suspend, activate, submitting };
}
