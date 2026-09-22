import { ChevronLeft, ChevronRight } from "lucide-react";
import "./StudentTable.css";

const DEFAULT_STUDENTS = [
  { id: 1, name: "Adebayo Tunde", email: "adebayotunde@gmail.com", trips: 10, status: "Active" },
  { id: 2, name: "Faith Emeka", email: "emekafaith@gmail.com", trips: 18, status: "Suspended" },
  { id: 3, name: "Jeremiah Banks", email: "jeremiahbanks@gmail.com", trips: 10, status: "Active" },
  { id: 4, name: "Tayo Jane", email: "tayojane02@gmail.com", trips: 0, status: "Unverified" },
];

function tripsLabel(trips) {
  return trips <= 1 ? `${trips} trip` : `${trips} trips`;
}

function StatusBadge({ status }) {
  const className =
    "student-table__status student-table__status--" + status.toLowerCase();
  return <span className={className}>{status}</span>;
}

export default function StudentTable({
  students = DEFAULT_STUDENTS,
  page = 1,
  pageCount = 1,
  onNextPage,
  onPrevPage,
}) {
  return (
    <div className="student-table-card">
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
          {students.map((student, i) => (
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