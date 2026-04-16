import { createContext, useContext, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

// ── Styles ───────────────────────────────────────────────────────────────────
if (!document.getElementById("vera-toast-styles")) {
  const s = document.createElement("style");
  s.id = "vera-toast-styles";
  s.textContent = `
    .vera-toast-stack {
      position: fixed;
      bottom: 28px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      gap: 10px;
      z-index: 999999;
      pointer-events: none;
    }

    .vera-toast {
      pointer-events: auto;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px 12px 16px;
      min-width: 240px;
      max-width: 420px;
      background: #1A1714;
      border-left: 3px solid #B59A6A;
      box-shadow: 0 8px 40px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2);
      font-family: 'Jost', 'Montserrat', sans-serif;
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.06em;
      color: #F5F0E8;
      cursor: pointer;
      will-change: transform, opacity;
      border-radius: 2px;

      animation: vera-toast-enter 0.35s cubic-bezier(0.21,1.02,0.73,1) both;
    }
    .vera-toast.vera-toast-exit {
      animation: vera-toast-exit 0.28s ease forwards;
    }

    .vera-toast.success { border-left-color: #4caf89; }
    .vera-toast.error   { border-left-color: #c0392b; }
    .vera-toast.warning { border-left-color: #e67e22; }
    .vera-toast.info    { border-left-color: #B59A6A; }

    .vera-toast-icon {
      flex-shrink: 0;
      width: 18px; height: 18px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
    }
    .vera-toast.success .vera-toast-icon { color: #4caf89; }
    .vera-toast.error   .vera-toast-icon { color: #c0392b; }
    .vera-toast.warning .vera-toast-icon { color: #e67e22; }
    .vera-toast.info    .vera-toast-icon { color: #B59A6A; }

    .vera-toast-msg { flex: 1; line-height: 1.5; }
    .vera-toast-close {
      flex-shrink: 0; margin-left: 6px;
      background: none; border: none; cursor: pointer;
      color: rgba(245,240,232,0.4); font-size: 16px; line-height: 1;
      padding: 0; transition: color 0.15s;
    }
    .vera-toast-close:hover { color: rgba(245,240,232,0.9); }

    @keyframes vera-toast-enter {
      from { opacity: 0; transform: translateY(20px) scale(0.94); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    @keyframes vera-toast-exit {
      from { opacity: 1; transform: translateY(0) scale(1); max-height: 80px; margin-bottom: 0; }
      to   { opacity: 0; transform: translateY(8px) scale(0.95); max-height: 0; margin-bottom: -10px; }
    }
  `;
  document.head.appendChild(s);
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icons = {
  success: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
    </svg>
  ),
};

// ── Context ───────────────────────────────────────────────────────────────────
const ToastCtx = createContext(null);

export function useToast() {
  return useContext(ToastCtx);
}

// ── Provider ──────────────────────────────────────────────────────────────────
export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    clearTimeout(timers.current[id]);
  }, []);

  const toast = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);
    timers.current[id] = setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  // Convenience wrappers
  toast.success = (msg, dur) => toast(msg, "success", dur);
  toast.error   = (msg, dur) => toast(msg, "error",   dur ?? 5000);
  toast.warning = (msg, dur) => toast(msg, "warning", dur);
  toast.info    = (msg, dur) => toast(msg, "info",    dur);

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      {createPortal(
        <div className="vera-toast-stack" aria-live="polite">
          {toasts.map(t => (
            <div
              key={t.id}
              className={`vera-toast ${t.type} ${t.exiting ? "vera-toast-exit" : ""}`}
              onClick={() => dismiss(t.id)}
              role="alert"
            >
              <span className="vera-toast-icon">{Icons[t.type]}</span>
              <span className="vera-toast-msg">{t.message}</span>
              <button
                className="vera-toast-close"
                onClick={(e) => { e.stopPropagation(); dismiss(t.id); }}
                aria-label="Dismiss"
              >×</button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  );
}
