import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Topbar from "../Topbar";
import ProfileHeader from "./ProfileHeader";
import ProfileMobileHeader from "./ProfileMobileHeader";
import ProfileMobileMenu from "./ProfileMobileMenu";
import PersonalInfoForm from "./PersonalInfoForm";
import ChangePasswordForm from "./ChangePasswordForm";
import RecentActivity from "./RecentActivity";
import DisableAccount from "./DisableAccount";
import { useAuth } from "../../context/AuthContext";
import { useAdminProfileActions } from "../../hooks/useAdminProfile";
import "./Profile.css";

const MOBILE_VIEW_TITLES = {
  edit: "Edit profile",
  password: "Change password",
  activity: "Recent activity",
};

export default function Profile() {
  const [mobileView, setMobileView] = useState("menu");
  const [infoError, setInfoError] = useState(null);
  const [infoSaved, setInfoSaved] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [deactivateError, setDeactivateError] = useState(null);

  const { user, logout } = useAuth();
  const { updateProfile, changePassword, deactivateAccount, submitting } =
    useAdminProfileActions();
  const navigate = useNavigate();

  if (!user) return null; // ProtectedLayout already guarantees a user, but keep TS/JS happy

  const name = `${user.first_name} ${user.last_name}`;
  const initials = `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`.toUpperCase();
  const lastUpdated = new Date(user.updated_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // PersonalInfoForm hands back { firstName, lastName, email, phone }; email
  // is dropped here on purpose — PATCH /admins/me doesn't accept it (it's
  // only ever changed through the verified-email flow, not this form).
  const handleSaveInfo = async ({ firstName, lastName, phone }) => {
    setInfoError(null);
    setInfoSaved(false);
    try {
      await updateProfile({ first_name: firstName, last_name: lastName, phone });
      setInfoSaved(true);
    } catch (err) {
      setInfoError(err.message);
    }
  };

  const handleUpdatePassword = async ({ current, next, confirm }) => {
    setPasswordError(null);
    setPasswordSaved(false);
    if (next !== confirm) {
      setPasswordError("New password and confirmation don't match.");
      return;
    }
    try {
      await changePassword(current, next);
      setPasswordSaved(true);
    } catch (err) {
      // 400 from the API when current_password doesn't match.
      setPasswordError(err.message);
    }
  };

  const handleDeactivate = async () => {
    setDeactivateError(null);
    if (
      !window.confirm(
        "Deactivate your admin account? This is irreversible — there's no self-reactivate endpoint."
      )
    )
      return;
    try {
      // deactivateAccount() already logs out (clears the token) on success.
      await deactivateAccount();
      navigate("/login", { replace: true });
    } catch (err) {
      // Most likely a 400: this would leave zero active admins.
      setDeactivateError(err.message);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="profile-page">
      {/* Desktop topbar (hidden on mobile) */}
      <div className="profile-page__desktop-topbar">
        <Topbar title="My Profile" showExport={false} />
      </div>

      {/* Mobile-only banner (hidden on desktop) */}
      <div className="profile-page__mobile-header">
        <ProfileMobileHeader name={name} role="Transport Administrator" email={user.email} />
      </div>

      {/* Desktop layout */}
      <div className="profile-page__content profile-page__content--desktop">
        <ProfileHeader name={name} role="Transport Administrator" email={user.email} />

        <div className="profile-page__columns">
          <div className="profile-page__main">
            <PersonalInfoForm
              initials={initials}
              firstName={user.first_name}
              lastName={user.last_name}
              email={user.email}
              phone={user.phone ?? ""}
              lastUpdated={lastUpdated}
              onSave={handleSaveInfo}
              saving={submitting}
              error={infoError}
              saved={infoSaved}
            />
            <ChangePasswordForm
              onUpdate={handleUpdatePassword}
              saving={submitting}
              error={passwordError}
              saved={passwordSaved}
            />
          </div>

          <div className="profile-page__side">
            <RecentActivity />
            <DisableAccount onDeactivate={handleDeactivate} error={deactivateError} />
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="profile-page__content profile-page__content--mobile">
        {mobileView === "menu" ? (
          <>
            <ProfileMobileMenu onSelectView={setMobileView} onSignOut={handleSignOut} />
            <DisableAccount onDeactivate={handleDeactivate} error={deactivateError} />
          </>
        ) : (
          <div className="profile-page__mobile-detail">
            <button className="profile-page__mobile-back" onClick={() => setMobileView("menu")}>
              <ChevronLeft size={18} /> {MOBILE_VIEW_TITLES[mobileView]}
            </button>

            {mobileView === "edit" && (
              <PersonalInfoForm
                hideHeader
                initials={initials}
                firstName={user.first_name}
                lastName={user.last_name}
                email={user.email}
                phone={user.phone ?? ""}
                lastUpdated={lastUpdated}
                onSave={handleSaveInfo}
                saving={submitting}
                error={infoError}
                saved={infoSaved}
              />
            )}
            {mobileView === "password" && (
              <ChangePasswordForm
                hideHeader
                onUpdate={handleUpdatePassword}
                saving={submitting}
                error={passwordError}
                saved={passwordSaved}
              />
            )}
            {mobileView === "activity" && <RecentActivity />}
          </div>
        )}
      </div>
    </div>
  );
}
