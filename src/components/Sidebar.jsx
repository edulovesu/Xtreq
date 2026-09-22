import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart2,
  FileText,
  Bus,
  MapPin,
  User,
  LogOut,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const NAV_ITEMS = [
  { label: "Revenue Overview", mobileLabel: "Dashboard", icon: BarChart2, to: "/" },
  { label: "Remittance Report", mobileLabel: "Reports", icon: FileText, to: "/remittance" },
  { label: "Bus Management", mobileLabel: "Buses", icon: Bus, to: "/busmanagement" },
  { label: "Route Management", mobileLabel: "Routes", icon: MapPin, to: "/routemanagement" },
  { label: "Student Lookup", icon: User, to: "/studentlookup" },
  
];

const MOBILE_PRIMARY = NAV_ITEMS.slice(0, 4);
const MOBILE_OVERFLOW = NAV_ITEMS.slice(4);

export default function Sidebar() {
  const [moreOpen, setMoreOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fullName = user ? `${user.first_name} ${user.last_name}` : "";
  const initials = user ? `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}` : "";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      {/* Desktop layout */}
      <div className="sidebar__top">
        <div className="sidebar__logo">XTREQ</div>

        <nav className="sidebar__nav">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    "sidebar__nav-item" + (isActive ? " sidebar__nav-item--active" : "")
                  }
                >
                  <span className="sidebar__nav-icon" aria-hidden="true">
                    <item.icon size={18} />
                  </span>
                  <span className="sidebar__nav-label">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="sidebar__bottom">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            "sidebar__user" + (isActive ? " sidebar__user--active" : "")
          }
        >
          <div className="sidebar__avatar">{initials}</div>
          <div>
            <div className="sidebar__user-name">{fullName}</div>
            <div className="sidebar__user-role">Transport Admin</div>
          </div>
        </NavLink>
        <button className="sidebar__logout" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Mobile layout: bottom tab bar with labels + "More" overflow */}
      <nav className="sidebar__mobile-nav">
        {MOBILE_PRIMARY.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              "sidebar__mobile-item" + (isActive ? " sidebar__mobile-item--active" : "")
            }
            onClick={() => setMoreOpen(false)}
          >
            <item.icon size={20} />
            <span>{item.mobileLabel}</span>
          </NavLink>
        ))}

        <div className="sidebar__more-wrap">
          <button
            className={
              "sidebar__mobile-item" + (moreOpen ? " sidebar__mobile-item--active" : "")
            }
            onClick={() => setMoreOpen((open) => !open)}
            aria-expanded={moreOpen}
          >
            <MoreHorizontal size={20} />
            <span>More</span>
          </button>

          {moreOpen && (
            <>
              <div
                className="sidebar__more-backdrop"
                onClick={() => setMoreOpen(false)}
              />
              <div className="sidebar__more-menu">
                {MOBILE_OVERFLOW.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className="sidebar__more-menu-item"
                    onClick={() => setMoreOpen(false)}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/profile"
                  className="sidebar__more-menu-item"
                  onClick={() => setMoreOpen(false)}
                >
                  <User size={18} />
                  My Profile
                </NavLink>
              </div>
            </>
          )}
        </div>
      </nav>
    </aside>
  );
}