import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useRecentTrips } from "../../hooks/useDashboard";
import "./RecentTrips.css";

export default function RecentTrips() {
  const { trips, count, page, pageCount, loading, error, nextPage, prevPage } =
    useRecentTrips(10);

  return (
    <div className="recent-trips">
      <div className="recent-trips__header">
        <div>
          <h2 className="recent-trips__title">Recent Trips</h2>
          <p className="recent-trips__subtitle">Most recent trips, all riders/buses</p>
        </div>
        <a className="recent-trips__view-all" href="#">
          View all <ArrowRight size={14} />
        </a>
      </div>

      {error && <p style={{ color: "#c0392b" }}>{error.message}</p>}

      <div className="recent-trips__table-wrap">
        <table className="recent-trips__table">
          <thead>
            <tr>
              <th>Trip ID</th>
              <th>Route</th>
              <th>Driver</th>
              <th>Bus</th>
              <th className="recent-trips__col-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>Loading…</td>
              </tr>
            ) : (
              trips.map((t) => (
                <tr key={t.id}>
                  <td className="recent-trips__id">#{t.id.slice(0, 8)}</td>
                  <td>{t.route ?? "—"}</td>
                  <td>{t.driver_name ?? "—"}</td>
                  <td>{t.bus_plate ?? "—"}</td>
                  <td className="recent-trips__col-right">
                    ₦{t.revenue_naira.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="recent-trips__footer">
        <span>
          {count === 0
            ? "No trips yet"
            : `Showing ${(page - 1) * 10 + 1}-${Math.min(page * 10, count)} of ${count}`}
        </span>
        <div className="recent-trips__pagination">
          <button aria-label="Previous page" onClick={prevPage} disabled={page <= 1}>
            <ChevronLeft size={16} />
          </button>
          <button className="recent-trips__page-num--active">{page}</button>
          <button aria-label="Next page" onClick={nextPage} disabled={page >= pageCount}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
