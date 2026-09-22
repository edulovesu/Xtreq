import { useState } from "react";
import { Search, ChevronDown, Filter } from "lucide-react";
import "./StudentToolbar.css";

const STATUS_OPTIONS = ["All status", "Active", "Suspended", "Unverified"];

export default function StudentToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onLookup,
}) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  return (
    <div className="student-toolbar">
      <div className="student-toolbar__search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="student-toolbar__row">
        <button
          className="student-toolbar__filter-btn"
          aria-label="Filter by status"
          onClick={() => setMobileFilterOpen((open) => !open)}
        >
          <Filter size={16} />
        </button>

        <div
          className={
            "student-toolbar__select" +
            (mobileFilterOpen ? " student-toolbar__select--mobile-open" : "")
          }
        >
          <select value={status} onChange={(e) => onStatusChange?.(e.target.value)}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="student-toolbar__select-chevron" />
        </div>

        <button className="student-toolbar__lookup" onClick={onLookup}>
          <Search size={16} /> Look up
        </button>
      </div>
    </div>
  );
}