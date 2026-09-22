import { Download, Bell } from "lucide-react";
import "./Topbar.css";

export default function Topbar({ title, onExport }) {
  return (
    <div className="topbar">
      <h1 className="topbar__title">{title}</h1>
      <div className="topbar__actions">
        <button className="topbar__export" onClick={onExport}>
          <Download size={16} /> Export CSV
        </button>
        <button className="topbar__bell" aria-label="Notifications">
          <Bell size={18} />
        </button>
      </div>
    </div>
  );
}
