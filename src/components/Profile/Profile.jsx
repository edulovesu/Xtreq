import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import Topbar from "../Topbar";
import ProfileHeader from "./ProfileHeader";
import ProfileMobileHeader from "./ProfileMobileHeader";
import ProfileMobileMenu from "./ProfileMobileMenu";
import PersonalInfoForm from "./PersonalInfoForm";
import ChangePasswordForm from "./ChangePasswordForm";
import RecentActivity from "./RecentActivity";
import DisableAccount from "./DisableAccount";
import "./Profile.css";

const MOBILE_VIEW_TITLES = {
  edit: "Edit profile",
  password: "Change password",
  activity: "Recent activity",
};

export default function Profile() {
  const [mobileView, setMobileView] = useState("menu");

  return (
    <div className="profile-page">
      {/* Desktop topbar (hidden on mobile) */}
      <div className="profile-page__desktop-topbar">
        <Topbar title="My Profile" showExport={false} />
      </div>

      {/* Mobile-only banner (hidden on desktop) */}
      <div className="profile-page__mobile-header">
        <ProfileMobileHeader
          name="Tayo Joe"
          role="Transport Administrator"
          email="tayojoe@gmail.com"
        />
      </div>

      {/* Desktop layout */}
      <div className="profile-page__content profile-page__content--desktop">
        <ProfileHeader
          name="Tayo Joe"
          role="Transport Administrator"
          email="tayojoe@gmail.com"
          remittedTotal="₦1.2M"
        />

        <div className="profile-page__columns">
          <div className="profile-page__main">
            <PersonalInfoForm
              initials="TJ"
              firstName="Tayo"
              lastName="Joe"
              email="tayojoe@gmail.com"
              phone="0812 3456 789"
              lastUpdated="May 24, 2026"
            />
            <ChangePasswordForm />
          </div>

          <div className="profile-page__side">
            <RecentActivity />
            <DisableAccount />
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="profile-page__content profile-page__content--mobile">
        {mobileView === "menu" ? (
          <>
            <ProfileMobileMenu
              onSelectView={setMobileView}
              onSignOut={() => {}}
            />
            <DisableAccount />
          </>
        ) : (
          <div className="profile-page__mobile-detail">
            <button
              className="profile-page__mobile-back"
              onClick={() => setMobileView("menu")}
            >
              <ChevronLeft size={18} /> {MOBILE_VIEW_TITLES[mobileView]}
            </button>

            {mobileView === "edit" && (
              <PersonalInfoForm
                hideHeader
                initials="TJ"
                firstName="Tayo"
                lastName="Joe"
                email="tayojoe@gmail.com"
                phone="0812 3456 789"
                lastUpdated="May 24, 2026"
              />
            )}
            {mobileView === "password" && <ChangePasswordForm hideHeader />}
            {mobileView === "activity" && <RecentActivity />}
          </div>
        )}
      </div>
    </div>
  );
}
