import { useCallback, useState } from "react";
import { api } from "../lib/apiClient";
import { useAsync } from "./useAsync";

// UI period labels -> API period values (both PeriodTabs and the summary
// endpoint use different casing/wording, so this is the one place that maps
// between them).
export const PERIOD_MAP = {
  Today: "today",
  "This week": "week",
  "This month": "month",
  Custom: "custom",
};

// GET /api/v1/admin/remittance/summary?period=today|week|month|custom
export function useRemittanceSummary(uiPeriod, range) {
  const period = PERIOD_MAP[uiPeriod] ?? "today";
  const isCustom = period === "custom";
  return useAsync(
    () =>
      api.get("/api/v1/admin/remittance/summary", {
        period,
        ...(isCustom ? { start: range?.start, end: range?.end } : {}),
      }),
    [period, range?.start, range?.end],
    { skip: isCustom && (!range?.start || !range?.end) }
  );
}

// GET /api/v1/admin/remittance/pending — the not-yet-remitted window.
// This is exactly what "Initiate remittance" shows and what POST /initiate
// with an empty body will record, so it doubles as the preview.
export function usePendingRemittance() {
  return useAsync(() => api.get("/api/v1/admin/remittance/pending"), []);
}

// GET /api/v1/admin/remittance/history?limit&offset
export function useRemittanceHistory(limit = 10) {
  const [offset, setOffset] = useState(0);
  const { data, loading, error, refetch } = useAsync(
    () => api.get("/api/v1/admin/remittance/history", { limit, offset }),
    [limit, offset]
  );

  const count = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(count / limit));

  return {
    history: data?.items ?? [],
    count,
    pageCount,
    page: Math.floor(offset / limit) + 1,
    loading,
    error,
    refetch,
    nextPage: () => setOffset((o) => Math.min(o + limit, (pageCount - 1) * limit)),
    prevPage: () => setOffset((o) => Math.max(o - limit, 0)),
  };
}

// Actions (initiate / settle) don't fit the read-only useAsync shape, since
// they run on a button click, not on mount — so they're plain async
// functions with their own submitting/error state.
export function useRemittanceActions() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Empty body = "remit the current pending window" (see GET /pending).
  const initiate = useCallback(async (periodStart, periodEnd) => {
    setSubmitting(true);
    setError(null);
    try {
      const body =
        periodStart && periodEnd
          ? { period_start: periodStart, period_end: periodEnd }
          : {};
      return await api.post("/api/v1/admin/remittance/initiate", body);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const settle = useCallback(async (remittanceId) => {
    setSubmitting(true);
    setError(null);
    try {
      return await api.patch(`/api/v1/admin/remittance/${remittanceId}/settle`);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  return { initiate, settle, submitting, error };
}
