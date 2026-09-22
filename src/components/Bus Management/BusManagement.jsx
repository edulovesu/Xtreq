import { useMemo, useState } from "react";
import Topbar from "../Topbar";
import BusToolbar from "./BusToolbar";
import BusTable from "./BusTable";
import RegisterBusModal from "./RegisterBusModal";
import { useVehicles, useVehicleActions } from "../../hooks/useVehicles";
import { useDrivers } from "../../hooks/useDrivers";
import "./BusManagement.css";

export default function BusManagement() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All status");
  const [modalOpen, setModalOpen] = useState(false);
  const [actionError, setActionError] = useState(null);

  // The API does the search/status matching server-side (GET /vehicles/vehicles?q&is_active),
  // so there's no client-side .filter() here the way the dummy version had one.
  const { vehicles, loading, error, refetch } = useVehicles({
    search,
    status: status === "All status" ? undefined : status,
  });
  const { create, update, remove } = useVehicleActions();
  const { drivers } = useDrivers();

  // VehicleResponse only carries driver_assigned_id, not a name — join
  // against the driver list (which has vehicle_id) to get one.
  const driverNameByVehicleId = useMemo(() => {
    const map = {};
    drivers.forEach((d) => {
      if (d.vehicle_id) map[d.vehicle_id] = `${d.first_name} ${d.last_name}`;
    });
    return map;
  }, [drivers]);

  const rows = vehicles.map((v) => ({
    id: v.id,
    plate: v.plate_number,
    label: v.vehicle_label_number,
    driver: driverNameByVehicleId[v.id] ?? "Unassigned",
    // Not exposed by this endpoint — see useVehicles.js for the gap this
    // flags (no per-bus trips/revenue-today field on the API yet).
    trips: null,
    revenue: null,
    status: v.is_active ? "Active" : "Inactive",
  }));

  const handleRegister = async ({ plateNumber, labelNumber, driverId, status: initialStatus }) => {
    setActionError(null);
    try {
      const created = await create({
        plate_number: plateNumber,
        vehicle_label_number: labelNumber,
        driver_assigned_id: driverId || undefined,
      });
      // New vehicles default to is_active=true server-side; only follow up
      // with a PATCH if the admin explicitly picked "Inactive" at creation.
      if (initialStatus === "Inactive") {
        await update(created.id, { is_active: false });
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setActionError(err.message);
    }
  };

  // Simplified stand-in for a full edit flow: the pencil icon toggles
  // active/inactive, which is the one field this page can safely patch
  // without a proper edit modal (driver reassignment has its own gotcha —
  // see PATCH /vehicles/{id}'s docstring: you can reassign a driver, but
  // not unset one, via this endpoint).
  const handleToggleStatus = async (bus) => {
    setActionError(null);
    try {
      await update(bus.id, { is_active: bus.status !== "Active" });
      refetch();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (bus) => {
    if (!window.confirm(`Delete ${bus.plate}? This fails if it still has a driver or trip history.`))
      return;
    setActionError(null);
    try {
      await remove(bus.id);
      refetch();
    } catch (err) {
      // 409 from the API (driver assigned / has trip history) surfaces here
      // as err.message, already formatted by apiClient.
      setActionError(err.message);
    }
  };

  return (
    <div className="bus-management-page">
      <Topbar title="Bus Management" />

      <div className="bus-management-page__content">
        <p style={{ color: "var(--blue-text-muted)", fontSize: 13, margin: "0 0 12px" }}>
          The current API does not expose per-bus trips-today or revenue-today totals, so those columns are shown as unavailable rather than estimated.
        </p>
        <BusToolbar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          onRegisterBus={() => setModalOpen(true)}
        />

        {(error || actionError) && (
          <p style={{ color: "#c0392b", margin: "0 0 12px" }}>
            {actionError || error.message}
          </p>
        )}

        {loading ? (
          <p style={{ padding: "24px 0" }}>Loading buses…</p>
        ) : (
          <BusTable buses={rows} onEdit={handleToggleStatus} onDelete={handleDelete} />
        )}
      </div>

      <RegisterBusModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onRegister={handleRegister}
        drivers={drivers}
      />
    </div>
  );
}
