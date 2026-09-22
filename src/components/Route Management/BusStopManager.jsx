import { useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { useBusStopActions } from "../../hooks/useRoutes";
import "./BusStopManager.css";

const emptyForm = { name: "", latitude: "", longitude: "" };

export default function BusStopManager({ stops = [], onChanged }) {
  const { create, update, remove } = useBusStopActions();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const beginCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError(null);
    setOpen(true);
  };

  const beginEdit = (stop) => {
    setEditing(stop);
    setForm({
      name: stop.name ?? "",
      latitude: String(stop.latitude ?? ""),
      longitude: String(stop.longitude ?? ""),
    });
    setError(null);
    setOpen(true);
  };

  const close = () => {
    if (!submitting) setOpen(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    setError(null);
    const name = form.name.trim();
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    if (!name) return setError("Stop name is required.");
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      return setError("Latitude must be a number between -90 and 90.");
    }
    if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      return setError("Longitude must be a number between -180 and 180.");
    }

    setSubmitting(true);
    try {
      const body = { name, latitude, longitude };
      if (editing) await update(editing.id, body);
      else await create(body);
      setOpen(false);
      onChanged?.();
    } catch (err) {
      setError(err.message || "Could not save the bus stop.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (stop) => {
    if (!window.confirm(`Delete bus stop “${stop.name}”?`)) return;
    setError(null);
    try {
      await remove(stop.id);
      onChanged?.();
    } catch (err) {
      setError(err.message || "Could not delete the bus stop.");
    }
  };

  return (
    <section className="bus-stop-manager">
      <div className="bus-stop-manager__header">
        <div>
          <h2>Bus stops</h2>
          <p>Manage the stops used when creating routes.</p>
        </div>
        <button className="bus-stop-manager__add" onClick={beginCreate}>
          <Plus size={16} /> Add stop
        </button>
      </div>

      {error && <p className="bus-stop-manager__error">{error}</p>}

      {stops.length === 0 ? (
        <div className="bus-stop-manager__empty">No bus stops have been created yet.</div>
      ) : (
        <div className="bus-stop-manager__list">
          {stops.map((stop) => (
            <div className="bus-stop-manager__row" key={stop.id}>
              <div>
                <strong>{stop.name}</strong>
                <span>{Number(stop.latitude).toFixed(6)}, {Number(stop.longitude).toFixed(6)}</span>
              </div>
              <div className="bus-stop-manager__actions">
                <button onClick={() => beginEdit(stop)} aria-label={`Edit ${stop.name}`}>
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(stop)} aria-label={`Delete ${stop.name}`}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="bus-stop-manager__modal-backdrop" onClick={close}>
          <form className="bus-stop-manager__modal" onSubmit={submit} onClick={(e) => e.stopPropagation()}>
            <div className="bus-stop-manager__modal-header">
              <h3>{editing ? "Edit bus stop" : "Add bus stop"}</h3>
              <button type="button" onClick={close} aria-label="Close"><X size={18} /></button>
            </div>
            <label>
              Stop name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Latitude
              <input type="number" step="any" min="-90" max="90" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} required />
            </label>
            <label>
              Longitude
              <input type="number" step="any" min="-180" max="180" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} required />
            </label>
            {error && <p className="bus-stop-manager__error">{error}</p>}
            <div className="bus-stop-manager__modal-footer">
              <button type="button" onClick={close} disabled={submitting}>Cancel</button>
              <button type="submit" disabled={submitting}>{submitting ? "Saving…" : "Save stop"}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
