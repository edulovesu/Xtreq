import { useState } from "react";
import { X } from "lucide-react";
import "./RegisterBusModal.css";

const STATUS_OPTIONS = ["Active", "Inactive"];

// drivers: AdminDriverListItem[] from useDrivers() — { id, first_name, last_name, ... }
export default function RegisterBusModal({ open, onClose, onRegister, drivers = [] }) {
  const [plateNumber, setPlateNumber] = useState("");
  const [labelNumber, setLabelNumber] = useState("");
  const [driverId, setDriverId] = useState("");
  const [status, setStatus] = useState("Active");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister?.({ plateNumber, labelNumber, driverId, status });
    setPlateNumber("");
    setLabelNumber("");
    setDriverId("");
    setStatus("Active");
  };

  return (
    <div className="register-bus-modal__backdrop" onClick={onClose}>
      <div
        className="register-bus-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-bus-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="register-bus-modal__header">
          <h2 id="register-bus-title" className="register-bus-modal__title">
            Register new bus
          </h2>
          <button
            className="register-bus-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="register-bus-modal__divider" />

        <form onSubmit={handleSubmit}>
          <div className="register-bus-modal__field">
            <label htmlFor="plateNumber">Plate number</label>
            <input
              id="plateNumber"
              type="text"
              placeholder="e.g. OAU-051-IFE"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              required
            />
          </div>

          <div className="register-bus-modal__field">
            <label htmlFor="labelNumber">Vehicle label number</label>
            <input
              id="labelNumber"
              type="text"
              placeholder="e.g. 051"
              value={labelNumber}
              onChange={(e) => setLabelNumber(e.target.value)}
              required
            />
          </div>

          <div className="register-bus-modal__field">
            <label htmlFor="assignDriver">Assign driver (optional)</label>
            <select
              id="assignDriver"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
            >
              <option value="">No driver yet</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.first_name} {d.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="register-bus-modal__field">
            <label htmlFor="initialStatus">Initial status</label>
            <select
              id="initialStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="register-bus-modal__footer">
            <button type="button" className="register-bus-modal__cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="register-bus-modal__submit">
              Register bus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
