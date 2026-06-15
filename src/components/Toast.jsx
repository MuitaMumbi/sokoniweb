function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type}`}>
      <span>{toast.type === "success" ? "✅" : toast.type === "warn" ? "⚠️" : "ℹ️"}</span>
      {toast.msg}
    </div>
  );
}