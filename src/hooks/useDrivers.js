import { api } from "../lib/apiClient";
import { useAsync } from "./useAsync";

// GET /api/v1/drivers?limit&offset -> { items: AdminDriverListItem[], count }
//
// Used in two places: the "Assign driver" dropdown in RegisterBusModal
// (needs real driver ids, not names), and BusManagement's join to fill in
// the "Assigned driver" column — VehicleResponse only has
// driver_assigned_id, no name, so we build an id -> name map from this list.
export function useDrivers({ limit = 200 } = {}) {
  const { data, loading, error, refetch } = useAsync(
    () => api.get("/api/v1/drivers", { limit }),
    [limit]
  );
  return { drivers: data?.items ?? [], count: data?.count ?? 0, loading, error, refetch };
}
