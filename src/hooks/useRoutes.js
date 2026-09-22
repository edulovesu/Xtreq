import { useCallback } from "react";
import { api } from "../lib/apiClient";
import { useAsync } from "./useAsync";

// GET /api/v1/routes/bus-stops -> BusStopResponse[] (not paginated)
export function useBusStops() {
  const { data, loading, error, refetch } = useAsync(
    () => api.get("/api/v1/routes/bus-stops"),
    []
  );
  return { stops: data ?? [], loading, error, refetch };
}

// GET /api/v1/routes/routes?q&is_active -> RouteResponse[] (not paginated, not admin-gated)
export function useRoutes({ search, status } = {}) {
  const isActive = status === "Active" ? true : status === "Inactive" ? false : undefined;
  const { data, loading, error, refetch } = useAsync(
    () => api.get("/api/v1/routes/routes", { q: search || undefined, is_active: isActive }),
    [search, isActive]
  );
  return { routes: data ?? [], loading, error, refetch };
}

export function useRouteActions() {
  const create = useCallback(
    // { name, start_stop_id, end_stop_id, fare_naira?, is_predefined_two_ticket_route?, is_active? }
    // distance_m is computed server-side — don't send it.
    (body) => api.post("/api/v1/routes/routes", body),
    []
  );
  const update = useCallback(
    (routeId, body) => api.patch(`/api/v1/routes/routes/${routeId}`, body),
    []
  );
  const remove = useCallback(
    // No FK guard here (unlike vehicles) — deleting a route referenced by
    // trip history won't 409, so confirm with the admin before calling this.
    (routeId) => api.del(`/api/v1/routes/routes/${routeId}`),
    []
  );
  return { create, update, remove };
}
