import { NavLink } from "react-router-dom";
import { SquarePen, Lock, User, History, ChevronRight, LogOut } from "lucide-react";
import "./ProfileMobileMenu.css";

const MENU_ITEMS = [
  {
    key: "edit",
    icon: SquarePen,
    title: "Edit profile",
    subtitle: "Name, email, phone number",
    type: "view",
  },
  {
    key: "password",
    icon: Lock,
    title: "Change password",
    subtitle: "Set new password",
    type: "view",
  },
  {
    key: "student-lookup",
    icon: User,
    title: "Student lookup",
    subtitle: "Search students",
    type: "link",
    to: "/studentlookup",
  },
  {
    key: "activity",
    icon: History,
    title: "Recent activity",
    subtitle: "Your history",
    type: "view",
  },
];

export default function ProfileMobileMenu({ onSelectView, onSignOut }) {
  return (
    <div className="profile-mobile-menu">
      <div className="profile-mobile-menu__list">
        {MENU_ITEMS.map((item) =>
          item.type === "link" ? (
            <NavLink key={item.key} to={item.to} className="profile-mobile-menu__item">
              <span className="profile-mobile-menu__icon">
                <item.icon size={18} />
              </span>
              <div className="profile-mobile-menu__text">
                <div className="profile-mobile-menu__title">{item.title}</div>
                <div className="profile-mobile-menu__subtitle">{item.subtitle}</div>
              </div>
              <ChevronRight size={18} className="profile-mobile-menu__chevron" />
            </NavLink>
          ) : (
            <button
              key={item.key}
              className="profile-mobile-menu__item"
              onClick={() => onSelectView(item.key)}
            >
              <span className="profile-mobile-menu__icon">
                <item.icon size={18} />
              </span>
              <div className="profile-mobile-menu__text">
                <div className="profile-mobile-menu__title">{item.title}</div>
                <div className="profile-mobile-menu__subtitle">{item.subtitle}</div>
              </div>
              <ChevronRight size={18} className="profile-mobile-menu__chevron" />
            </button>
          )
        )}
      </div>

      <button className="profile-mobile-menu__sign-out" onClick={onSignOut}>
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
