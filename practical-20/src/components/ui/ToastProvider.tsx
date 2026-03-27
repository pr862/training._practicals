import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AlertToast } from './Alert';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastOptions = {
  type: ToastType;
  message: string;
  id?: string;
  durationMs?: number;
};

type ToastItem = Required<Pick<ToastOptions, 'id' | 'type' | 'message'>> & {
  durationMs: number;
};

type ToastContextValue = {
  toast: (options: ToastOptions) => string;
  success: (message: string, options?: Omit<ToastOptions, 'type' | 'message'>) => string;
  error: (message: string, options?: Omit<ToastOptions, 'type' | 'message'>) => string;
  warning: (message: string, options?: Omit<ToastOptions, 'type' | 'message'>) => string;
  info: (message: string, options?: Omit<ToastOptions, 'type' | 'message'>) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = options.id ?? createId();
      const durationMs = options.durationMs ?? 4500;
      setToasts((prev) => [...prev, { id, type: options.type, message: options.message, durationMs }]);
      window.setTimeout(() => dismiss(id), durationMs);
      return id;
    },
    [dismiss]
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      success: (message, options) => toast({ type: 'success', message, ...options }),
      error: (message, options) => toast({ type: 'error', message, ...options }),
      warning: (message, options) => toast({ type: 'warning', message, ...options }),
      info: (message, options) => toast({ type: 'info', message, ...options }),
      dismiss,
    }),
    [dismiss, toast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <AlertToast
        alerts={toasts.map((t) => ({ id: t.id, type: t.type, message: t.message }))}
        onDismiss={dismiss}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

