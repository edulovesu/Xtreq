import { useState } from 'react';
import { X } from 'lucide-react';
import './RouteModal.css';

const STATUS_OPTIONS = ['Active', 'Inactive'];

export default function RouteModal({ open, onClose, onRegister, stops = [], submitting = false }) {
  const [startStopId, setStartStopId] = useState('');
  const [endStopId, setEndStopId] = useState('');
  const [fare, setFare] = useState('');
  const [status, setStatus] = useState('Active');

  if (!open) return null;

  const hasEnoughStops = stops.length >= 2;
  const sameStop = startStopId && startStopId === endStopId;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startStopId || !endStopId || sameStop) return;

    const startName = stops.find((s) => s.id === startStopId)?.name ?? '';
    const endName = stops.find((s) => s.id === endStopId)?.name ?? '';

    onRegister?.({
      name: `${startName} → ${endName}`,
      start_stop_id: startStopId,
      end_stop_id: endStopId,
      fare_naira: Number(fare) || undefined,
      is_active: status === 'Active',
    });

    setStartStopId('');
    setEndStopId('');
    setFare('');
    setStatus('Active');
  };

  return (
    <div className="register-route-modal__backdrop" onClick={onClose}>
      <div
        className="register-route-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-route-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="register-route-modal__header">
          <h2 id="register-route-title" className="register-route-modal__title">
            Register New Route
          </h2>
          <button
            type="button"
            className="register-route-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="register-route-modal__divider" />

        {!hasEnoughStops ? (
          <p style={{ color: "#c0392b" }}>
            You need at least 2 bus stops before you can create a route. There's no bus-stop
            management UI yet — stops currently need to be created directly against
            POST /routes/bus-stops.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="register-route-modal__field">
              <label htmlFor="start">Start Location</label>
              <select
                id="start"
                value={startStopId}
                onChange={(e) => setStartStopId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a stop
                </option>
                {stops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="register-route-modal__field">
              <label htmlFor="end">Destination</label>
              <select
                id="end"
                value={endStopId}
                onChange={(e) => setEndStopId(e.target.value)}
                required
              >
                <option value="" disabled>
                  Select a stop
                </option>
                {stops.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {sameStop && (
                <span style={{ color: "#c0392b", fontSize: "0.8rem" }}>
                  Start and destination can't be the same stop.
                </span>
              )}
            </div>

            <div className="register-route-modal__field">
              <label htmlFor="fare">Fare (₦)</label>
              <input
                id="fare"
                type="number"
                placeholder="e.g. 100"
                value={fare}
                onChange={(e) => setFare(e.target.value)}
                required
              />
            </div>

            <div className="register-route-modal__field">
              <label htmlFor="initialStatus">Initial Status</label>
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

            <div className="register-route-modal__footer">
              <button
                type="button"
                className="register-route-modal__cancel"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="register-route-modal__submit" disabled={submitting || sameStop}>
                {submitting ? "Registering…" : "Register Route"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}