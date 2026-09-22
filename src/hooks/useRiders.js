import { useCallback, useState } from "react";
import { api } from "../lib/apiClient";
import { useAsync } from "./useAsync";

// GET /api/v1/riders?q&account_status&rider_type&limit&offset -> { items, count }
//
// Note on statuses: the API's account_status filter only knows "active" /
// "suspended" — "Unverified" (as shown in the StudentToolbar dropdown) is a
// separate boolean (`verified`) on the rider, not an account_status value.
// So "Unverified" is handled client-side below rather than sent as a param.
export function useRiders({ search, status, limit = 10 } = {}) {
  const [offset, setOffset] = useState(0);

  const accountStatus =
    status === "Active" ? "active" : status === "Suspended" ? "suspended" : undefined;

  const { data, loading, error, refetch } = useAsync(
    () =>
      api.get("/api/v1/riders", {
        q: search || undefined,
        account_status: accountStatus,
        limit,
        offset,
      }),
    [search, accountStatus, limit, offset]
  );

  let items = data?.items ?? [];
  let count = data?.count ?? 0;
  if (status === "Unverified") {
    items = items.filter((r) => !r.verified);
    count = items.length; // best-effort once the "unverified" narrowing happens client-side
  }

  const pageCount = Math.max(1, Math.ceil(count / limit));

  return {
    riders: items,
    count,
    pageCount,
    page: Math.floor(offset / limit) + 1,
    loading,
    error,
    refetch,
    resetPage: () => setOffset(0),
    nextPage: () => setOffset((o) => Math.min(o + limit, (pageCount - 1) * limit)),
    prevPage: () => setOffset((o) => Math.max(o - limit, 0)),
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
