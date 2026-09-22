import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./ChangePasswordForm.css";

function PasswordField({ id, label, placeholder, value, onChange }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="change-password__field">
      <label htmlFor={id}>{label}</label>
      <div className="change-password__input-wrap">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="change-password__toggle-visibility"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordForm({ onUpdate, hideHeader = false }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate?.({ current, next, confirm });
  };

  return (
    <form className="change-password" onSubmit={handleSubmit}>
      {!hideHeader && (
        <>
          <div className="change-password__header">
            <h2 className="change-password__title">Change password</h2>
            <p className="change-password__subtitle">Choose a strong password</p>
          </div>
          <div className="change-password__divider" />
        </>
      )}

      <PasswordField
        id="currentPassword"
        label="Current password"
        placeholder="Enter current password"
        value={current}
        onChange={setCurrent}
      />

      <div className="change-password__grid">
        <PasswordField
          id="newPassword"
          label="New password"
          placeholder="New password"
          value={next}
          onChange={setNext}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm new password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={setConfirm}
        />
      </div>

      <div className="change-password__footer">
        <span className="change-password__hint">Enter a strong password</span>
        <button type="submit" className="change-password__submit-btn">
          Update password
        </button>
      </div>
    </form>
  );
}
