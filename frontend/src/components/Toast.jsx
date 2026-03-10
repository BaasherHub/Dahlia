import './Toast.css';

export default function Toast({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          <div className="toast__content">
            <p className="toast__message">{toast.message}</p>
          </div>
          <button
            className="toast__close"
            onClick={() => onRemove(toast.id)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
