import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/* ── Types ───────────────────────────────────────────────────── */
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (type: Toast['type'], message: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

/* ── Context ─────────────────────────────────────────────────── */
const ToastContext = createContext<ToastContextValue | null>(null);

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styles = {
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  error: 'bg-coral/10 text-coral border-coral/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  info: 'bg-sky-50 text-sky-800 border-sky-200',
};

/* ── Toast Provider ──────────────────────────────────────────── */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((type: Toast['type'], message: string) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => remove(id), 3000);
  }, [remove]);

  const value: ToastContextValue = {
    toast,
    success: (m) => toast('success', m),
    error: (m) => toast('error', m),
    warning: (m) => toast('warning', m),
    info: (m) => toast('info', m),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-2" role="region" aria-label="Notifications">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg min-w-[280px] max-w-[420px] ${styles[t.type]}`}
                role="alert"
                aria-live="polite"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-body-small flex-1">{t.message}</span>
                <button
                  onClick={() => remove(t.id)}
                  className="flex-shrink-0 p-0.5 rounded-lg hover:bg-black/5 transition-colors"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

/* ── useToast hook ───────────────────────────────────────────── */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

/* ═══════════════════════════════════════════════════════════════
   Legacy standalone Toast components (backward-compatible)
   ═══════════════════════════════════════════════════════════════ */

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgClass: 'bg-emerald',
    textClass: 'text-white',
    borderClass: 'border-emerald/30',
    progressClass: 'bg-white/40',
  },
  error: {
    icon: XCircle,
    bgClass: 'bg-coral',
    textClass: 'text-white',
    borderClass: 'border-coral/30',
    progressClass: 'bg-white/40',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-[#F59E0B]',
    textClass: 'text-white',
    borderClass: 'border-[#F59E0B]/30',
    progressClass: 'bg-white/40',
  },
  info: {
    icon: Info,
    bgClass: 'bg-[#2563EB]',
    textClass: 'text-white',
    borderClass: 'border-[#2563EB]/30',
    progressClass: 'bg-white/40',
  },
};

/** Standalone Toast component (self-managing close timer) */
export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  useState(() => {
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 120, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 120, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`${config.bgClass} ${config.textClass} ${config.borderClass} border rounded-xl shadow-lg flex items-start gap-3 px-4 py-3.5 min-w-[300px] max-w-[420px] relative overflow-hidden`}
      role="alert"
      aria-live="polite"
    >
      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        className={`absolute bottom-0 left-0 right-0 h-0.5 ${config.progressClass} origin-left`}
      />

      <Icon className={`w-5 h-5 ${config.textClass} flex-shrink-0 mt-0.5`} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug">{message}</p>
      </div>

      <button
        onClick={onClose}
        className="flex-shrink-0 p-0.5 rounded-lg hover:bg-white/20 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

/* ── Toast item types for container ─────────────────────────── */
export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

/** Container component that renders a list of toasts */
export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none" role="region" aria-label="Notifications">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => onRemove(toast.id)}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ── Legacy hook (backward-compatible, manages its own state) ─ */
let toastIdCounter = 0;

export function useLegacyToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastItem['type'] = 'info') => {
    const id = `toast_${++toastIdCounter}_${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message: string) => addToast(message, 'success'),
    [addToast]
  );

  const error = useCallback(
    (message: string) => addToast(message, 'error'),
    [addToast]
  );

  const warning = useCallback(
    (message: string) => addToast(message, 'warning'),
    [addToast]
  );

  const info = useCallback(
    (message: string) => addToast(message, 'info'),
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    ToastContainer: () => <ToastContainer toasts={toasts} onRemove={removeToast} />,
  };
}
