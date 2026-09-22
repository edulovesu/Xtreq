import { useState } from "react";
import { Search, ChevronDown, Plus, Filter } from "lucide-react";
import "./RouteToolbar.css";

const STATUS_OPTIONS = ["All status", "Active", "Inactive"];

export default function RouteToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onAddRoute,
}) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <div className="route-toolbar">
      <div className="route-toolbar__search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search routes..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="route-toolbar__row">
        <button
          className="route-toolbar__filter-btn"
          aria-label="Filter by status"
          onClick={() => setMobileFilterOpen((open) => !open)}
        >
          <Filter size={16} />
        </button>

        <div
          className={
            "route-toolbar__select" +
            (mobileFilterOpen ? " route-toolbar__select--mobile-open" : "")
          }
        >
          <select value={status} onChange={(e) => onStatusChange?.(e.target.value)}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="route-toolbar__select-chevron" />
        </div>

        <button className="route-toolbar__add" onClick={onAddRoute}>
          <Plus size={16} /> Add route
        </button>
      </div>
    </div>
  );
}