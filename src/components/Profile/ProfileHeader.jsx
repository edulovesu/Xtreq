import "./ProfileHeader.css";

export default function ProfileHeader({ name, role, email }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="profile-header">
      <div className="profile-header__identity">
        <div className="profile-header__avatar">{initials}</div>
        <div>
          <div className="profile-header__name">{name}</div>
          <div className="profile-header__role">{role}</div>
          <div className="profile-header__email">{email}</div>
        </div>
      </div>
    </div>
  );
}
