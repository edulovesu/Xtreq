import { ArrowRight } from "lucide-react";
import { useAdminActivity } from "../../hooks/useAdminProfile";
import "./RecentActivity.css";

function timeLabel(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function RecentActivity() {
  const { items, loading, error } = useAdminActivity(5);

  return (
    <div className="recent-activity">
      <div className="recent-activity__header">
        <div>
          <h2 className="recent-activity__title">Recent activity</h2>
          <p className="recent-activity__subtitle">Your last actions in the system</p>
        </div>
        <a className="recent-activity__view-all" href="#">
          View all <ArrowRight size={14} />
        </a>
      </div>

      {error && <p style={{ color: "#c0392b" }}>{error.message}</p>}

      {loading ? (
        <p style={{ padding: "16px 0" }}>Loading…</p>
      ) : items.length === 0 ? (
        // This log only covers rider dispute actions, trip refunds, and
        // remittance lifecycle events (see AdminActivityResponse) — an
        // empty list here just means none of those happened yet, not
        // that nothing has been done.
        <p style={{ padding: "16px 0" }}>No logged activity yet.</p>
      ) : (
        <ul className="recent-activity__list">
          {items.map((item) => (
            <li className="recent-activity__item" key={item.id}>
              <span className="recent-activity__dot recent-activity__dot--success" aria-hidden="true" />
              <div className="recent-activity__content">
                <div className="recent-activity__item-title">{item.description}</div>
                <div className="recent-activity__item-detail">{item.action}</div>
              </div>
              <span className="recent-activity__time">{timeLabel(item.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
