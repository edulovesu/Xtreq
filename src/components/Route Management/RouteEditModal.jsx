import { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./RouteEditModal.css";

export default function RouteEditModal({ open, route, stops = [], onClose, onSave, submitting = false }) {
  const [startStopId, setStartStopId] = useState("");
  const [endStopId, setEndStopId] = useState("");
  const [fare, setFare] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (!open || !route) return;
    setStartStopId(route.start_stop_id ?? "");
    setEndStopId(route.end_stop_id ?? "");
    setFare(route.fare_naira ?? "");
    setStatus(route.is_active ? "Active" : "Inactive");
  }, [open, route]);

  if (!open || !route) return null;

  const sameStop = startStopId && startStopId === endStopId;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!startStopId || !endStopId || sameStop || fare === "") return;

    onSave?.({
      start_stop_id: startStopId,
      end_stop_id: endStopId,
      fare_naira: Number(fare),
      is_active: status === "Active",
    });
  };

  return (
    <div className="route-edit-modal__backdrop" onClick={onClose}>
      <div className="route-edit-modal" role="dialog" aria-modal="true" aria-labelledby="route-edit-title" onClick={(e) => e.stopPropagation()}>
        <div className="route-edit-modal__header">
          <h2 id="route-edit-title">Edit Route</h2>
          <button type="button" className="route-edit-modal__close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="route-edit-modal__divider" />

        <form onSubmit={handleSubmit}>
          <div className="route-edit-modal__field">
            <label htmlFor="edit-route-start">Start location</label>
            <select id="edit-route-start" value={startStopId} onChange={(e) => setStartStopId(e.target.value)} required>
              <option value="" disabled>Select a stop</option>
              {stops.map((stop) => <option key={stop.id} value={stop.id}>{stop.name}</option>)}
            </select>
          </div>

          <div className="route-edit-modal__field">
            <label htmlFor="edit-route-end">Destination</label>
            <select id="edit-route-end" value={endStopId} onChange={(e) => setEndStopId(e.target.value)} required>
              <option value="" disabled>Select a stop</option>
              {stops.map((stop) => <option key={stop.id} value={stop.id}>{stop.name}</option>)}
            </select>
            {sameStop && <span className="route-edit-modal__error">Start and destination can't be the same stop.</span>}
          </div>

          <div className="route-edit-modal__field">
            <label htmlFor="edit-route-fare">Fare (₦)</label>
            <input id="edit-route-fare" type="number" min="0" step="1" value={fare} onChange={(e) => setFare(e.target.value)} required />
          </div>

          <div className="route-edit-modal__field">
            <label htmlFor="edit-route-status">Status</label>
            <select id="edit-route-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="route-edit-modal__footer">
            <button type="button" className="route-edit-modal__cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="route-edit-modal__submit" disabled={submitting || sameStop}>
              {submitting ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
