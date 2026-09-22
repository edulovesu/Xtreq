import "./SummaryCard.css";

export default function SummaryCard({ label, value, sublabel }) {
  return (
    <div className="summary-card">
      <div className="summary-card__label">{label}</div>
      <div className="summary-card__value">{value}</div>
      <div className="summary-card__sublabel">{sublabel}</div>
    </div>
  );
}
