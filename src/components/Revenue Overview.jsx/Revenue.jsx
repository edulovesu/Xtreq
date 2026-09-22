import { Bus, AlertTriangle } from "lucide-react";
import Topbar from '../Topbar';
import StatCard from "./StatCard";
import RevenueChart from "./RevenueChart";
import RecentTrips from "./RecentTrips";
import Naira from '../../assets/Naira.svg'
import { useDashboardSummary } from "../../hooks/useDashboard";
import "./Revenue.css";

// null happens when yesterday had zero rides/revenue — no baseline to
// compare against, so there's no honest percentage to show (see
// DashboardSummaryResponse.rides_change_pct / revenue_change_pct docs).
function formatTrend(pct) {
  if (pct == null) return null;
  const sign = pct >= 0 ? "↑" : "↓";
  return `${sign} ${Math.abs(pct).toFixed(0)}%`;
}

export default function Revenue() {
  const { data, loading, error } = useDashboardSummary();

  return (
    <div className="revenue-page">
      <Topbar title="Revenue Overview" />

      <div className="revenue-page__content">
        {error && <p style={{ color: "#c0392b" }}>{error.message}</p>}

        <div className="revenue-page__stats">
          <StatCard
            icon={<Bus size={18} />}
            trend={formatTrend(data?.rides_change_pct)}
            value={loading ? "…" : String(data?.rides_today ?? 0)}
            label="Rides today"
          />
          <StatCard
            icon={<img src={Naira} alt="" className="stat-card__icon-img" />}
            trend={formatTrend(data?.revenue_change_pct)}
            value={loading ? "…" : `₦${(data?.revenue_today_naira ?? 0).toLocaleString()}`}
            label="Revenue today"
          />
          <StatCard
            icon={<AlertTriangle size={18} />}
            trend={data ? `${data.fraud_alerts} flag${data.fraud_alerts === 1 ? "" : "s"}` : null}
            value={loading ? "…" : String(data?.fraud_alerts ?? 0)}
            label="Fraud alerts"
          />
        </div>

        <RevenueChart />
        <RecentTrips />
      </div>
    </div>
  );
}
