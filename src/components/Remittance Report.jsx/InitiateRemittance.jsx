import { ChevronDown, ArrowRight } from "lucide-react";
import "./InitiateRemittance.css";

export default function InitiateRemittance({
  periodLabel = "June 06, 2026 → Today",
  ridesCompleted = 2780,
  grossRevenue = 278000,
  oauReceives = 222400,
  onRemit,
  submitting = false,
}) {
  return (
    <div className="initiate-remittance">
      <h2 className="initiate-remittance__title">Initiate remittance</h2>

      <label className="initiate-remittance__field-label">Period</label>
      <button className="initiate-remittance__period-select">
        <span>{periodLabel}</span>
        <ChevronDown size={16} />
      </button>

      <div className="initiate-remittance__summary">
        <div className="initiate-remittance__summary-row">
          <span>Rides completed</span>
          <span>{ridesCompleted.toLocaleString()}</span>
        </div>
        <div className="initiate-remittance__summary-row">
          <span>Gross revenue</span>
          <span>₦{grossRevenue.toLocaleString()}</span>
        </div>
        <div className="initiate-remittance__summary-row initiate-remittance__summary-row--total">
          <span>OAU receives</span>
          <span>₦{oauReceives.toLocaleString()}</span>
        </div>
      </div>

      <button className="initiate-remittance__submit" onClick={onRemit} disabled={submitting || ridesCompleted === 0}>
        {submitting ? "Remitting…" : `Remit ₦${oauReceives.toLocaleString()} to OAU`}
        {!submitting && <ArrowRight size={16} />}
      </button>
    </div>
  );
}