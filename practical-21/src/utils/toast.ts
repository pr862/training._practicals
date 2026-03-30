export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastPayload = {
  type: ToastType;
  message: string;
  id?: string;
  durationMs?: number;
};

export type ToastItem = Required<Pick<ToastPayload, 'id' | 'type' | 'message'>> & {
  durationMs: number;
};

type ToastListener = (toast: ToastItem) => void;

const listeners = new Set<ToastListener>();

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const subscribeToast = (listener: ToastListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const emitToast = (toast: ToastPayload) => {
  const item: ToastItem = {
    id: toast.id ?? createId(),
    type: toast.type,
    message: toast.message,
    durationMs: toast.durationMs ?? 4500,
  };

  listeners.forEach((listener) => listener(item));
  return item.id;
};
