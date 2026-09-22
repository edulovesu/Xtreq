import { useEffect, useState } from "react";
import Topbar from "../Topbar";
import StudentToolbar from "./StudentToolbar";
import StudentTable from "./StudentTable";
import { useRiders } from "../../hooks/useRiders";
import "./StudentLookup.css";

function riderStatus(rider) {
  // "Unverified" is derived client-side (see useRiders.js) — it's the
  // `verified` boolean, independent of account_status ('active'/'suspended').
  if (!rider.verified) return "Unverified";
  return rider.account_status === "suspended" ? "Suspended" : "Active";
}

export default function StudentLookup() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All status");

  const { riders, page, pageCount, loading, error, resetPage, nextPage, prevPage } = useRiders({
    search,
    status,
  });

  // A filter change should land back on page 1 — otherwise you can end up
  // on an offset that no longer has any matching rows.
  useEffect(() => {
    resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  const rows = riders.map((r) => ({
    id: r.id,
    name: `${r.first_name} ${r.last_name}`,
    email: r.email,
    trips: r.trips_booked,
    status: riderStatus(r),
  }));

  return (
    <div className="student-lookup-page">
      <Topbar title="Student Lookup" />

      <div className="student-lookup-page__content">
        <StudentToolbar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
        />

        {error && <p style={{ color: "#c0392b", margin: "0 0 12px" }}>{error.message}</p>}

        {loading ? (
          <p style={{ padding: "24px 0" }}>Loading students…</p>
        ) : (
          <StudentTable
            students={rows}
            page={page}
            pageCount={pageCount}
            onNextPage={nextPage}
            onPrevPage={prevPage}
          />
        )}
      </div>
    </div>
  );
}