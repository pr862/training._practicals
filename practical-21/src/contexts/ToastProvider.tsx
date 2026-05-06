import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { emitToast, subscribeToast, type ToastItem, type ToastPayload, type ToastType } from '../utils/toast';

type ToastContextValue = {
  toast: (options: ToastPayload) => string;
  success: (message: string, options?: Omit<ToastPayload, 'type' | 'message'>) => string;
  error: (message: string, options?: Omit<ToastPayload, 'type' | 'message'>) => string;
  warning: (message: string, options?: Omit<ToastPayload, 'type' | 'message'>) => string;
  info: (message: string, options?: Omit<ToastPayload, 'type' | 'message'>) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toastStyles: Record<ToastType, string> = {
  success: 'border-emerald-400/20 bg-neutral-950/95 text-white',
  error: 'border-rose-400/20 bg-neutral-950/95 text-white',
  warning: 'border-amber-400/20 bg-neutral-950/95 text-white',
  info: 'border-sky-400/20 bg-neutral-950/95 text-white',
};

const toastAccent: Record<ToastType, string> = {
  success: 'bg-emerald-400',
  error: 'bg-rose-400',
  warning: 'bg-amber-400',
  info: 'bg-sky-400',
};

const ToastItemView: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  return (
    <div className={`overflow-hidden rounded-2xl border shadow-2xl backdrop-blur ${toastStyles[toast.type]}`}>
      <div className={`h-1 ${toastAccent[toast.type]}`} />
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-5">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="rounded-lg px-1.5 py-0.5 text-xs text-white/60 hover:text-white"
          aria-label="Dismiss notification"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToast((toast) => {
      setToasts((prev) => [...prev, toast]);
      window.setTimeout(() => dismiss(toast.id), toast.durationMs);
    });

    return unsubscribe;
  }, [dismiss]);

  const value = useMemo<ToastContextValue>(
    () => ({
      toast: (options) => emitToast(options),
      success: (message, options) => emitToast({ type: 'success', message, ...options }),
      error: (message, options) => emitToast({ type: 'error', message, ...options }),
      warning: (message, options) => emitToast({ type: 'warning', message, ...options }),
      info: (message, options) => emitToast({ type: 'info', message, ...options }),
      dismiss,
    }),
    [dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.length > 0 ? (
        <div className="fixed right-4 top-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
          {toasts.map((toast) => (
            <ToastItemView key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
