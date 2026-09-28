import { useMemo, useState } from "react";
import Topbar from "../Topbar";
import RouteToolbar from "./RouteToolbar";
import RouteTable from "./RouteTable";
import RouteModal from "./RouteModal";
import RouteEditModal from "./RouteEditModal";
import BusStopManager from "./BusStopManager";
import { useRoutes, useRouteActions, useBusStops } from "../../hooks/useRoutes";
import "./RouteManagement.css";

export default function RouteManagement() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All status");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Search/status are matched server-side (GET /routes/routes?q&is_active).
  const { routes, loading, error, refetch } = useRoutes({
    search,
    status: status === "All status" ? undefined : status,
  });
  const { create, remove, update } = useRouteActions();
  const { stops, refetch: refetchStops } = useBusStops();

  // RouteResponse only carries start_stop_id/end_stop_id, not stop names —
  // join against the bus-stops list to show "Gate → SUB" style labels.
  const stopNameById = useMemo(() => {
    const map = {};
    stops.forEach((s) => {
      map[s.id] = s.name;
    });
    return map;
  }, [stops]);

  const rows = routes.map((r) => ({
    id: r.id,
    from: stopNameById[r.start_stop_id] ?? "Unknown stop",
    to: stopNameById[r.end_stop_id] ?? "Unknown stop",
    fare: r.fare_naira,
    status: r.is_active ? "Active" : "Inactive",
    start_stop_id: r.start_stop_id,
    end_stop_id: r.end_stop_id,
    is_active: r.is_active,
  }));

  const handleRegister = async (body) => {
    setActionError(null);
    setSubmitting(true);
    try {
      await create(body);
      setModalOpen(false);
      refetch();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (route) => {
    if (
      !window.confirm(
        `Delete ${route.from} → ${route.to}? This route won't be checked against existing trip history, so make sure nothing still depends on it.`
      )
    )
      return;
    setActionError(null);
    try {
      await remove(route.id);
      refetch();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleEdit = async (body) => {
    if (!editingRoute) return;
    setActionError(null);
    setSubmitting(true);
    try {
      await update(editingRoute.id, body);
      setEditingRoute(null);
      refetch();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="route-management-page">
      <Topbar title="Route Management" />

      <div className="route-management-page__content">
        <RouteToolbar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          onAddRoute={() => setModalOpen(true)}
        />

        {(error || actionError) && (
          <p style={{ color: "#c0392b", margin: "0 0 12px" }}>
            {actionError || error.message}
          </p>
        )}

        {loading ? (
          <p style={{ padding: "24px 0" }}>Loading routes…</p>
        ) : (
          <RouteTable routes={rows} onEdit={(route) => setEditingRoute(route)} onDelete={handleDelete} />
        )}

        <BusStopManager stops={stops} onChanged={refetchStops} />
      </div>

      <RouteEditModal
        open={Boolean(editingRoute)}
        route={editingRoute ? routes.find((r) => r.id === editingRoute.id) : null}
        stops={stops}
        onClose={() => setEditingRoute(null)}
        onSave={handleEdit}
        submitting={submitting}
      />

      <RouteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onRegister={handleRegister}
        stops={stops}
        submitting={submitting}
      />
    </div>
  );
}