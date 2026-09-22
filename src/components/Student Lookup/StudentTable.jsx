import { ChevronLeft, ChevronRight } from "lucide-react";
import "./StudentTable.css";



function tripsLabel(trips) {
  return trips <= 1 ? `${trips} trip` : `${trips} trips`;
}

function StatusBadge({ status }) {
  const className =
    "student-table__status student-table__status--" + status.toLowerCase();
  return <span className={className}>{status}</span>;
}

export default function StudentTable({
  students = [],
  page = 1,
  pageCount = 1,
  onNextPage,
  onPrevPage,
}) {
  return (
    <div className="student-table-card">
      <div className="student-table__wrap">
      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Trips booked</th>
            <th>Account status</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: "28px 12px", textAlign: "center" }}>
                No students found.
              </td>
            </tr>
          ) : students.map((student, i) => (
            <tr key={`${student.id}-${i}`}>
              <td className="student-table__name">{student.name}</td>
              <td>{student.email}</td>
              <td>{tripsLabel(student.trips)}</td>
              <td>
                <StatusBadge status={student.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div className="student-table__footer">
        <span>Page {page} of {pageCount}</span>
        <div className="student-table__pagination">
          <button aria-label="Previous page" onClick={onPrevPage} disabled={page <= 1}>
            <ChevronLeft size={16} />
          </button>
          <button className="student-table__page-num--active">{page}</button>
          <button aria-label="Next page" onClick={onNextPage} disabled={page >= pageCount}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}