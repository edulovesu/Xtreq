import { useState } from "react";
import { ArrowRight, Filter } from "lucide-react";
import { useRevenueByDay } from "../../hooks/useDashboard";
import "./RevenueChart.css";

// UI labels -> API `period` query values.
const RANGE_TO_PERIOD = { "This week": "week", "This month": "month", Custom: "custom" };
const RANGES = Object.keys(RANGE_TO_PERIOD);

function formatNaira(amount) {
  return `₦${Math.round(amount / 1000)}k`;
}

const todayIso = new Date().toISOString().slice(0, 10);

export default function RevenueChart() {
  const [range, setRange] = useState("This week");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  // Draft dates from the two <input type="date">s; only become the actual
  // query range once "Apply" is clicked, otherwise every keystroke would refetch.
  const [draftStart, setDraftStart] = useState("");
  const [draftEnd, setDraftEnd] = useState("");
  const [appliedRange, setAppliedRange] = useState(null);

  const period = RANGE_TO_PERIOD[range];
  const { data, loading, error } = useRevenueByDay(period, appliedRange);

  const items = data?.items ?? [];
  const max = Math.max(1, ...items.map((d) => d.revenue_naira));

  return (
    <div className="revenue-chart">
      <div className="revenue-chart__header">
        <div>
          <h2 className="revenue-chart__title">Revenue by day</h2>
          <p className="revenue-chart__subtitle">
            {period === "week" ? "Last 7 days" : period === "month" ? "Last 30 days" : "Custom range"}
          </p>
        </div>

        <button
          className="revenue-chart__mobile-filter"
          aria-label="Filter revenue by day"
          onClick={() => setMobileFiltersOpen((open) => !open)}
        >
          <Filter size={16} />
        </button>

        <div
          className={
            "revenue-chart__controls" +
            (mobileFiltersOpen ? " revenue-chart__controls--mobile-open" : "")
          }
        >
          <div className="revenue-chart__range-toggle">
            {RANGES.map((r) => (
              <button
                key={r}
                className={
                  "revenue-chart__range-btn" +
                  (r === range ? " revenue-chart__range-btn--active" : "")
                }
                onClick={() => setRange(r)}
              >
                {r}
              </button>
            ))}
          </div>

          {range === "Custom" && (
            <div className="revenue-chart__date-range">
              <input type="date" value={draftStart} max={todayIso} onChange={(e) => setDraftStart(e.target.value)} />
              <ArrowRight size={14} />
              <input type="date" value={draftEnd} max={todayIso} onChange={(e) => setDraftEnd(e.target.value)} />
              <button
                className="revenue-chart__apply"
                disabled={!draftStart || !draftEnd}
                onClick={() => setAppliedRange({ start: draftStart, end: draftEnd })}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <p style={{ color: "#c0392b" }}>{error.message}</p>}

      {loading ? (
        <p style={{ padding: "24px 0" }}>Loading…</p>
      ) : (
        <div className="revenue-chart__bars">
          {items.map((d) => {
            const isToday = d.day === todayIso;
            const heightPct = (d.revenue_naira / max) * 100;
            const label = new Date(d.day + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" });
            return (
              <div className="revenue-chart__bar-col" key={d.day}>
                <span className="revenue-chart__bar-value">{formatNaira(d.revenue_naira)}</span>
                <div className="revenue-chart__track">
                  <div
                    className={
                      "revenue-chart__bar" + (isToday ? " revenue-chart__bar--active" : "")
                    }
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span
                  className={
                    "revenue-chart__day-label" + (isToday ? " revenue-chart__day-label--active" : "")
                  }
                >
                  {isToday ? "Today" : label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="revenue-chart__footer">
        {period === "week" ? "Week" : period === "month" ? "Month" : "Range"} total: ₦
        {(data?.total_revenue_naira ?? 0).toLocaleString()}
      </div>
    </div>
  );
}
