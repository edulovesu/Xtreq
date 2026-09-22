import "./DisableAccount.css";

export default function DisableAccount({ onDeactivate }) {
  return (
    <div className="disable-account">
      <h2 className="disable-account__title">Disable your account</h2>
      <div className="disable-account__divider" />

      <div className="disable-account__box">
        <span className="disable-account__warning">This action is irreversible</span>
        <button className="disable-account__deactivate-btn" onClick={onDeactivate}>
          Deactivate
        </button>
      </div>
    </div>
  );
}
