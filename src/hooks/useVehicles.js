import { useCallback } from "react";
import { api } from "../lib/apiClient";
import { useAsync } from "./useAsync";

// GET /api/v1/vehicles/vehicles?q&is_active -> VehicleResponse[] (NOT paginated —
// every match comes back at once, so there's no offset/limit here).
//
// IMPORTANT gap vs. the current dummy UI: VehicleResponse only has
// { id, plate_number, vehicle_label_number, driver_assigned_id, is_active,
// device_key }. There is no driver *name*, no trips-today, and no
// revenue-today on this endpoint — those three columns in BusTable can't be
// filled from this API as it stands. Driver name needs a join against
// GET /drivers (match on vehicle_id); trips/revenue "today" per bus isn't
// exposed by any endpoint yet. Flagging this rather than inventing numbers.
export function useVehicles({ search, status } = {}) {
  const isActive = status === "Active" ? true : status === "Inactive" ? false : undefined;
  const { data, loading, error, refetch } = useAsync(
    () => api.get("/api/v1/vehicles/vehicles", { q: search || undefined, is_active: isActive }),
    [search, isActive]
  );
  return { vehicles: data ?? [], loading, error, refetch };
}

export function useVehicleActions() {
  const create = useCallback(
    (body) => api.post("/api/v1/vehicles/vehicles", body),
    []
  );
  const update = useCallback(
    (vehicleId, body) => api.patch(`/api/v1/vehicles/vehicles/${vehicleId}`, body),
    []
  );
  const remove = useCallback(
    // 409s if the bus has an assigned driver or trip history — surface
    // err.message from apiClient's ApiError to the user rather than a raw 409.
    (vehicleId) => api.del(`/api/v1/vehicles/vehicles/${vehicleId}`),
    []
  );
  return { create, update, remove };
}
