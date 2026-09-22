import "./DisableAccount.css";

export default function DisableAccount({ onDeactivate, error = null, disabled = false }) {
  return (
    <div className="disable-account">
      <h2 className="disable-account__title">Disable your account</h2>
      <div className="disable-account__divider" />

      <div className="disable-account__box">
        <span className="disable-account__warning">This action is irreversible</span>
        <button className="disable-account__deactivate-btn" onClick={onDeactivate} disabled={disabled}>
          Deactivate
        </button>
      </div>
      {error && <p style={{ color: "#c0392b", margin: "8px 0 0" }}>{error}</p>}
    </div>
  );
}
