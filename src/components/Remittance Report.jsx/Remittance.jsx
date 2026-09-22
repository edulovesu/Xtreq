import { useState } from "react";
import Topbar from "../Topbar";
import PeriodTabs from "./PeriodTabs";
import SummaryCard from "./SummaryCard";
import InitiateRemittance from "./InitiateRemittance";
import RemittanceHistory from "./RemittanceHistory";
import {
  useRemittanceSummary,
  usePendingRemittance,
  useRemittanceHistory,
  useRemittanceActions,
} from "../../hooks/useRemittance";
import "./Remittance.css";

function formatPeriodLabel(startIso, endIso) {
  if (!startIso || !endIso) return "";
  const start = new Date(startIso);
  const end = new Date(endIso);
  const fmt = (d) => d.toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" });
  const isToday = end.toDateString() === new Date().toDateString();
  return `${fmt(start)} → ${isToday ? "Today" : fmt(end)}`;
}

function formatHistoryDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

function capitalize(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

export default function Remittance() {
  const [period, setPeriod] = useState("Today");
  const [actionError, setActionError] = useState(null);

  const { data: summary, loading: summaryLoading, error: summaryError } =
    useRemittanceSummary(period);
  const {
    data: pending,
    loading: pendingLoading,
    error: pendingError,
    refetch: refetchPending,
  } = usePendingRemittance();
  const {
    history,
    page,
    pageCount,
    loading: historyLoading,
    error: historyError,
    refetch: refetchHistory,
    nextPage,
    prevPage,
  } = useRemittanceHistory();
  const { initiate, submitting } = useRemittanceActions();

  const handleRemit = async () => {
    setActionError(null);
    try {
      await initiate();
      refetchPending();
      refetchHistory();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const mappedHistory = history.map((row) => ({
    date: formatHistoryDate(row.period_start),
    totalRides: row.total_rides,
    gross: row.gross_revenue_naira,
    oauShare: row.oau_share_naira,
    xtreqMargin: row.xtreq_margin_naira,
    status: capitalize(row.status),
  }));

  const loadError = summaryError || pendingError || historyError;

  return (
    <div className="remittance-page">
      <Topbar title="Remittance Report" />

      <div className="remittance-page__content">
        <PeriodTabs onChange={setPeriod} />

        {(loadError || actionError) && (
          <p style={{ color: "#c0392b", margin: 0 }}>
            {actionError || loadError.message}
          </p>
        )}

        <div className="remittance-page__summary-cards">
          <SummaryCard
            label="TOTAL RIDES"
            value={summaryLoading ? "…" : (summary?.total_rides ?? 0)}
            sublabel="Completed bookings"
          />
          <SummaryCard
            label="GROSS REVENUE"
            value={summaryLoading ? "…" : `₦${(summary?.gross_revenue_naira ?? 0).toLocaleString()}`}
            sublabel={`${summary?.total_rides ?? 0} rides`}
          />
          <SummaryCard
            label="OAU SHARE OWED"
            value={summaryLoading ? "…" : `₦${(summary?.oau_share_naira ?? 0).toLocaleString()}`}
            sublabel="This period"
          />
          <SummaryCard
            label="XTREQ MARGIN"
            value={summaryLoading ? "…" : `₦${(summary?.xtreq_margin_naira ?? 0).toLocaleString()}`}
            sublabel="This period"
          />
        </div>

        <InitiateRemittance
          periodLabel={
            pendingLoading ? "Loading…" : formatPeriodLabel(pending?.period_start, pending?.period_end)
          }
          ridesCompleted={pending?.total_rides ?? 0}
          grossRevenue={pending?.gross_revenue_naira ?? 0}
          oauReceives={pending?.oau_share_naira ?? 0}
          onRemit={handleRemit}
          submitting={submitting}
        />

        <RemittanceHistory
          history={mappedHistory}
          loading={historyLoading}
          page={page}
          pageCount={pageCount}
          onNextPage={nextPage}
          onPrevPage={prevPage}
        />
      </div>
    </div>
  );
}