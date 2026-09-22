import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import "./PersonalInfoForm.css";

export default function PersonalInfoForm({
  initials,
  firstName: initialFirstName,
  lastName: initialLastName,
  email,
  phone: initialPhone,
  lastUpdated,
  onSave,
  hideHeader = false,
  saving = false,
  error = null,
  saved = false,
}) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [phone, setPhone] = useState(initialPhone);

  // Keep the fields in sync if the cached user changes elsewhere (e.g. a
  // successful save updates AuthContext, which flows back down as new props).
  useEffect(() => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setPhone(initialPhone);
  }, [initialFirstName, initialLastName, initialPhone]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.({ firstName, lastName, phone });
  };

  return (
    <form className="personal-info" onSubmit={handleSubmit}>
      {!hideHeader && (
        <>
          <div className="personal-info__header">
            <h2 className="personal-info__title">Personal information</h2>
            <p className="personal-info__subtitle">Update your information</p>
          </div>
          <div className="personal-info__divider" />
        </>
      )}

      <div className="personal-info__photo-row">
        <div className="personal-info__avatar">{initials}</div>
        <div>
          <button type="button" className="personal-info__upload-btn" disabled>
            <Upload size={15} /> Upload photo
          </button>
          <p className="personal-info__photo-hint">Not supported by the API yet</p>
        </div>
      </div>

      <div className="personal-info__grid">
        <div className="personal-info__field">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="personal-info__field">
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="personal-info__field">
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" value={email} disabled title="Email isn't editable here" />
        </div>
        <div className="personal-info__field">
          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      {error && <p style={{ color: "#c0392b", margin: "8px 0 0" }}>{error}</p>}
      {saved && !error && <p style={{ color: "#1e8449", margin: "8px 0 0" }}>Saved.</p>}

      <div className="personal-info__divider" />

      <div className="personal-info__footer">
        <span className="personal-info__last-updated">Last updated {lastUpdated}</span>
        <button type="submit" className="personal-info__save-btn" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
