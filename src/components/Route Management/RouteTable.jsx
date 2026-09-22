import { ArrowRight, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import "./RouteTable.css";

const DEFAULT_ROUTES = [
  { id: 1, from: "Gate", to: "SUB", fare: 100, status: "Active" },
  { id: 2, from: "Gate", to: "Road 7", fare: 200, status: "Active" },
  { id: 3, from: "Gate", to: "Market", fare: 200, status: "Active" },
  { id: 4, from: "Gate", to: "Halls", fare: 200, status: "Inactive" },
  { id: 5, from: "SUB", to: "Gate", fare: 100, status: "Active" },
  { id: 6, from: "Road 7", to: "Gate", fare: 200, status: "Active" },
  { id: 7, from: "Market", to: "Gate", fare: 200, status: "Active" },
  { id: 8, from: "Halls", to: "Gate", fare: 200, status: "Active" },
];

function StatusBadge({ status }) {
  const className =
    "route-table__status" +
    (status === "Active" ? " route-table__status--active" : " route-table__status--inactive");
  return (
    <span className={className}>
      <span className="route-table__status-dot" aria-hidden="true" />
      {status}
    </span>
  );
}

export default function RouteTable({ routes = DEFAULT_ROUTES, onEdit, onDelete }) {
  return (
    <div className="route-table-card">
      <table className="route-table">
        <thead>
          <tr>
            <th>Route</th>
            <th>Fare</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.id}>
              <td className="route-table__route">
                {route.from} <ArrowRight size={15} className="route-table__arrow" /> {route.to}
              </td>
              <td>₦{route.fare}</td>
              <td>
                <StatusBadge status={route.status} />
              </td>
              <td>
                <div className="route-table__actions">
                  <button aria-label={`Edit ${route.from} to ${route.to}`} onClick={() => onEdit?.(route)}>
                    <Pencil size={15} />
                  </button>
                  <button aria-label={`Delete ${route.from} to ${route.to}`} onClick={() => onDelete?.(route)}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="route-table__footer">
        <span>
          Showing 1-{routes.length} of {routes.length}
        </span>
        <div className="route-table__pagination">
          <button aria-label="Previous page">
            <ChevronLeft size={16} />
          </button>
          <button className="route-table__page-num--active">1</button>
          <button aria-label="Next page">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
