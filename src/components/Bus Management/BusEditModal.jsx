import { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./RegisterBusModal.css";

export default function BusEditModal({ open, bus, drivers = [], onClose, onSave, submitting = false }) {
  const [plateNumber, setPlateNumber] = useState("");
  const [labelNumber, setLabelNumber] = useState("");
  const [driverId, setDriverId] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (!open || !bus) return;
    setPlateNumber(bus.plate ?? "");
    setLabelNumber(bus.label ?? "");
    setDriverId(bus.driverId ?? "");
    setStatus(bus.status ?? "Active");
  }, [open, bus]);

  if (!open || !bus) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave?.({
      plate_number: plateNumber.trim(),
      vehicle_label_number: labelNumber.trim(),
      ...(driverId ? { driver_assigned_id: driverId } : {}),
      is_active: status === "Active",
    });
  };

  return (
    <div className="register-bus-modal__backdrop" onClick={onClose}>
      <div className="register-bus-modal" role="dialog" aria-modal="true" aria-labelledby="edit-bus-title" onClick={(e) => e.stopPropagation()}>
        <div className="register-bus-modal__header">
          <h2 id="edit-bus-title" className="register-bus-modal__title">Edit bus</h2>
          <button type="button" className="register-bus-modal__close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="register-bus-modal__divider" />

        <form onSubmit={handleSubmit}>
          <div className="register-bus-modal__field">
            <label htmlFor="edit-plate-number">Bus ID / plate number</label>
            <input id="edit-plate-number" type="text" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} required />
          </div>

          <div className="register-bus-modal__field">
            <label htmlFor="edit-label-number">Vehicle label number</label>
            <input id="edit-label-number" type="text" value={labelNumber} onChange={(e) => setLabelNumber(e.target.value)} required />
          </div>

          <div className="register-bus-modal__field">
            <label htmlFor="edit-driver">Assigned driver</label>
            <select id="edit-driver" value={driverId} onChange={(e) => setDriverId(e.target.value)}>
              <option value="">Keep current assignment</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>{driver.first_name} {driver.last_name}</option>
              ))}
            </select>
            <span className="register-bus-modal__hint">The current API supports assigning a driver, but does not support clearing an existing assignment.</span>
          </div>

          <div className="register-bus-modal__field">
            <label htmlFor="edit-bus-status">Status</label>
            <select id="edit-bus-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="register-bus-modal__field">
            <label>Trips today</label>
            <input value={bus.trips ?? "Not available from API"} disabled readOnly />
            <span className="register-bus-modal__hint">The current vehicle API does not expose a per-bus trips-today value, so it cannot be safely persisted from this screen.</span>
          </div>

          <div className="register-bus-modal__field">
            <label>Revenue today</label>
            <input value={bus.revenue != null ? `₦${bus.revenue.toLocaleString()}` : "Not available from API"} disabled readOnly />
            <span className="register-bus-modal__hint">The current vehicle API does not expose a per-bus revenue-today value.</span>
          </div>

          <div className="register-bus-modal__footer">
            <button type="button" className="register-bus-modal__cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="register-bus-modal__submit" disabled={submitting}>{submitting ? "Saving…" : "Save changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
