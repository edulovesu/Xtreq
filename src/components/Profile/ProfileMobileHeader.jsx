import "./ProfileMobileHeader.css";

export default function ProfileMobileHeader({ name, role, email }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="profile-mobile-header">
      <div className="profile-mobile-header__avatar">{initials}</div>
      <div className="profile-mobile-header__name">{name}</div>
      <div className="profile-mobile-header__role">{role}</div>
      <div className="profile-mobile-header__email">{email}</div>
    </div>
  );
}
