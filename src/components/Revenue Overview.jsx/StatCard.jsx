import "./StatCard.css";

export default function StatCard({ icon, trend, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-card__top">
        <div className="stat-card__icon">{icon}</div>
        {trend && <span className="stat-card__trend">{trend}</span>}
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}