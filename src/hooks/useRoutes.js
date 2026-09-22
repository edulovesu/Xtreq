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

export function useBusStopActions() {
  const create = useCallback(
    (body) => api.post("/api/v1/routes/bus-stops", body),
    []
  );
  const update = useCallback(
    (stopId, body) => api.patch(`/api/v1/routes/bus-stops/${stopId}`, body),
    []
  );
  const remove = useCallback(
    (stopId) => api.del(`/api/v1/routes/bus-stops/${stopId}`),
    []
  );
  return { create, update, remove };
}

// GET /api/v1/routes/routes?q&is_active -> RouteResponse[] (not paginated)
export function useRoutes({ search, status } = {}) {
  const isActive = status === "Active" ? true : status === "Inactive" ? false : undefined;
  const { data, loading, error, refetch } = useAsync(
    () => api.get("/api/v1/routes/routes", { q: search || undefined, is_active: isActive }),
    [search, isActive]
  );
  return { routes: data ?? [], loading, error, refetch };
}

export function useRouteActions() {
  const create = useCallback((body) => api.post("/api/v1/routes/routes", body), []);
  const update = useCallback(
    (routeId, body) => api.patch(`/api/v1/routes/routes/${routeId}`, body),
    []
  );
  const remove = useCallback(
    (routeId) => api.del(`/api/v1/routes/routes/${routeId}`),
    []
  );
  return { create, update, remove };
}
