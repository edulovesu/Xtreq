import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import "./BusTable.css";

function StatusBadge({ status }) {
  const className =
    "bus-table__status" +
    (status === "Active" ? " bus-table__status--active" : " bus-table__status--inactive");
  return (
    <span className={className}>
      <span className="bus-table__status-dot" aria-hidden="true" />
      {status}
    </span>
  );
}

export default function BusTable({ buses = [], onEdit, onDelete }) {
  return (
    <div className="bus-table-card">
      <div className="bus-table__wrap">
        <table className="bus-table">
          <thead>
            <tr>
              <th>Bus ID</th>
              <th>Assigned driver</th>
              <th>Trips today</th>
              <th>Revenue today</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id}>
                <td className="bus-table__id">{bus.plate}</td>
                <td>{bus.driver}</td>
                <td>{bus.trips ?? "—"}</td>
                <td>{bus.revenue != null ? `₦${bus.revenue.toLocaleString()}` : "—"}</td>
                <td>
                  <StatusBadge status={bus.status} />
                </td>
                <td>
                  <div className="bus-table__actions">
                    <button aria-label={`Toggle status for ${bus.plate}`} onClick={() => onEdit?.(bus)}>
                      <Pencil size={15} />
                    </button>
                    <button aria-label={`Delete ${bus.plate}`} onClick={() => onDelete?.(bus)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bus-table__footer">
        <span>
          Showing 1-{buses.length} of {buses.length}
        </span>
        <div className="bus-table__pagination">
          <button aria-label="Previous page">
            <ChevronLeft size={16} />
          </button>
          <button className="bus-table__page-num--active">1</button>
          <button aria-label="Next page">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}