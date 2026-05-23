import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

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
    bgLightClass: 'bg-emerald-light',
    textClass: 'text-white',
    iconClass: 'text-white',
    borderClass: 'border-emerald/30',
    progressClass: 'bg-white/40',
  },
  error: {
    icon: XCircle,
    bgClass: 'bg-coral',
    bgLightClass: 'bg-coral/10',
    textClass: 'text-white',
    iconClass: 'text-white',
    borderClass: 'border-coral/30',
    progressClass: 'bg-white/40',
  },
  warning: {
    icon: AlertTriangle,
    bgClass: 'bg-[#F59E0B]',
    bgLightClass: 'bg-[#FEF3C7]',
    textClass: 'text-white',
    iconClass: 'text-white',
    borderClass: 'border-[#F59E0B]/30',
    progressClass: 'bg-white/40',
  },
  info: {
    icon: Info,
    bgClass: 'bg-[#2563EB]',
    bgLightClass: 'bg-[#DBEAFE]',
    textClass: 'text-white',
    iconClass: 'text-white',
    borderClass: 'border-[#2563EB]/30',
    progressClass: 'bg-white/40',
  },
};

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const config = toastConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

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

      <Icon className={`w-5 h-5 ${config.iconClass} flex-shrink-0 mt-0.5`} />

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

/* Toast container - place at app level */
export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

export interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
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

/* Hook to manage toasts */
let toastIdCounter = 0;

export function useToast() {
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

  return { toasts, addToast, removeToast, success, error, warning, info, ToastContainer: () => <ToastContainer toasts={toasts} onRemove={removeToast} /> };
}
