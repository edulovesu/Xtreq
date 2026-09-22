import { ArrowRight } from "lucide-react";
import "./RecentActivity.css";

const DEFAULT_ACTIVITY = [
  { id: 1, title: "Remittance initiated", detail: "₦104,000 remitted to OAU", time: "7:40 AM", tone: "success" },
  { id: 2, title: "Bus registered", detail: "OAU-067-IFE • Oluwaseun Ike assigned", time: "7:40 AM", tone: "success" },
  { id: 3, title: "Route activated", detail: "Halls → Road 7", time: "7:40 AM", tone: "success" },
  { id: 4, title: "CSV export downloaded", detail: "Revenue report • May 2-24, 2026", time: "Yesterday", tone: "success" },
  { id: 5, title: "Bus deactivated", detail: "OAU-013-IFE • removed from service", time: "June 10", tone: "danger" },
];

export default function RecentActivity({ activity = DEFAULT_ACTIVITY }) {
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

      <ul className="recent-activity__list">
        {activity.map((item) => (
          <li className="recent-activity__item" key={item.id}>
            <span
              className={
                "recent-activity__dot recent-activity__dot--" + item.tone
              }
              aria-hidden="true"
            />
            <div className="recent-activity__content">
              <div className="recent-activity__item-title">{item.title}</div>
              <div className="recent-activity__item-detail">{item.detail}</div>
            </div>
            <span className="recent-activity__time">{item.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
