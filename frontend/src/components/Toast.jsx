import './Toast.css';

export default function Toast({ toasts, removeToast }) {
  if (!toasts?.length) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type || 'info'}`}
          role="alert"
        >
          <span className="toast__message">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="toast-close"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
