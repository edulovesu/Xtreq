import { useState } from "react";
import { Upload } from "lucide-react";
import "./PersonalInfoForm.css";

export default function PersonalInfoForm({
  initials,
  firstName: initialFirstName,
  lastName: initialLastName,
  email: initialEmail,
  phone: initialPhone,
  lastUpdated,
  onSave,
  hideHeader = false,
}) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.({ firstName, lastName, email, phone });
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
          <button type="button" className="personal-info__upload-btn">
            <Upload size={15} /> Upload photo
          </button>
          <p className="personal-info__photo-hint">PNG or JPG • Max 2MB</p>
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
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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

      <div className="personal-info__divider" />

      <div className="personal-info__footer">
        <span className="personal-info__last-updated">Last updated {lastUpdated}</span>
        <button type="submit" className="personal-info__save-btn">
          Save changes
        </button>
      </div>
    </form>
  );
}
