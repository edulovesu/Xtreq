import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import "./RemittanceHistory.css";

const DEFAULT_HISTORY = [
  { date: "May 07", totalRides: 306, gross: 30600, oauShare: 24480, xtreqMargin: 6120, status: "Pending" },
  { date: "May 05", totalRides: 420, gross: 42000, oauShare: 33600, xtreqMargin: 8400, status: "Settled" },
  { date: "April 30", totalRides: 1020, gross: 102000, oauShare: 81600, xtreqMargin: 20400, status: "Settled" },
];

function StatusBadge({ status }) {
  const className =
    "remittance-history__status" +
    (status === "Settled"
      ? " remittance-history__status--settled"
      : " remittance-history__status--pending");
  return <span className={className}>{status}</span>;
}

export default function RemittanceHistory({
  history = DEFAULT_HISTORY,
  loading = false,
  page = 1,
  pageCount = 1,
  onNextPage,
  onPrevPage,
}) {
  return (
    <div className="remittance-history">
      <div className="remittance-history__header">
        <div>
          <h2 className="remittance-history__title">Remittance history</h2>
          <p className="remittance-history__subtitle">All past settlements</p>
        </div>
        <a className="remittance-history__view-all" href="#">
          View all <ArrowRight size={14} />
        </a>
      </div>

      {loading ? (
        <p style={{ padding: "16px 0" }}>Loading…</p>
      ) : (
        <div className="remittance-history__table-wrap">
          <table className="remittance-history__table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Total rides</th>
                <th>Gross</th>
                <th>OAU share</th>
                <th>XTREQ margin</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, i) => (
                <tr key={`${row.date}-${i}`}>
                  <td className="remittance-history__date">{row.date}</td>
                  <td>{row.totalRides}</td>
                  <td>₦{row.gross.toLocaleString()}</td>
                  <td>₦{row.oauShare.toLocaleString()}</td>
                  <td>₦{row.xtreqMargin.toLocaleString()}</td>
                  <td>
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="remittance-history__footer">
        <span>Page {page} of {pageCount}</span>
        <div className="remittance-history__pagination">
          <button aria-label="Previous page" onClick={onPrevPage} disabled={page <= 1}>
            <ChevronLeft size={16} />
          </button>
          <button className="remittance-history__page-num--active">{page}</button>
          <button aria-label="Next page" onClick={onNextPage} disabled={page >= pageCount}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}