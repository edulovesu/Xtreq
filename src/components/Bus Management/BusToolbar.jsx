import { useState } from "react";
import { Search, ChevronDown, Plus, Filter } from "lucide-react";
import "./BusToolbar.css";

const STATUS_OPTIONS = ["All status", "Active", "Inactive"];

export default function BusToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onRegisterBus,
}) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <div className="bus-toolbar">
      <div className="bus-toolbar__search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search by bus ID or driver..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="bus-toolbar__row">
        <button
          className="bus-toolbar__filter-btn"
          aria-label="Filter by status"
          onClick={() => setMobileFilterOpen((open) => !open)}
        >
          <Filter size={16} />
        </button>

        <div
          className={
            "bus-toolbar__select" +
            (mobileFilterOpen ? " bus-toolbar__select--mobile-open" : "")
          }
        >
          <select value={status} onChange={(e) => onStatusChange?.(e.target.value)}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="bus-toolbar__select-chevron" />
        </div>

        <button className="bus-toolbar__register" onClick={onRegisterBus}>
          <Plus size={16} /> Register bus
        </button>
      </div>
    </div>
  );
}