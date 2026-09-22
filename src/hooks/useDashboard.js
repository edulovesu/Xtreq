import { useState } from "react";
import { api } from "../lib/apiClient";
import { useAsync } from "./useAsync";

// GET /api/v1/admin/reports/summary
// -> { rides_today, revenue_today_naira, rides_change_pct, revenue_change_pct, fraud_alerts }
export function useDashboardSummary() {
  return useAsync(() => api.get("/api/v1/admin/reports/summary"), []);
}

// GET /api/v1/admin/reports/revenue-by-day?period=week|month|custom&start&end
// -> { items: [{ day, rides, revenue_naira }], total_revenue_naira, period }
export function useRevenueByDay(period, range) {
  const isCustom = period === "custom";
  return useAsync(
    () =>
      api.get("/api/v1/admin/reports/revenue-by-day", {
        period,
        ...(isCustom ? { start: range?.start, end: range?.end } : {}),
      }),
    [period, range?.start, range?.end],
    // Don't fire until both custom dates are picked.
    { skip: isCustom && (!range?.start || !range?.end) }
  );
}

// GET /api/v1/admin/reports/trips?limit&offset -> { items, count }
// Paginated, so this hook owns the page/limit state and exposes nextPage/prevPage.
export function useRecentTrips(limit = 10) {
  const [offset, setOffset] = useState(0);

  const { data, loading, error, refetch } = useAsync(
    () => api.get("/api/v1/admin/reports/trips", { limit, offset }),
    [limit, offset]
  );

  const count = data?.count ?? 0;
  const page = Math.floor(offset / limit) + 1;
  const pageCount = Math.max(1, Math.ceil(count / limit));

  return {
    trips: data?.items ?? [],
    count,
    page,
    pageCount,
    loading,
    error,
    refetch,
    nextPage: () => setOffset((o) => Math.min(o + limit, (pageCount - 1) * limit)),
    prevPage: () => setOffset((o) => Math.max(o - limit, 0)),
  };
}
