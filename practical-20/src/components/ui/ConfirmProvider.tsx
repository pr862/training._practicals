import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export type ConfirmVariant = 'primary' | 'danger';

export type ConfirmOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

type ConfirmState = Required<Pick<ConfirmOptions, 'title' | 'description' | 'confirmText' | 'cancelText' | 'variant'>> & {
  open: boolean;
};

const initialState: ConfirmState = {
  open: false,
  title: 'Are you sure?',
  description: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'primary',
};

export const ConfirmProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const [state, setState] = useState<ConfirmState>(initialState);

  const close = useCallback((result: boolean) => {
    resolverRef.current?.(result);
    resolverRef.current = null;
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    setState({
      open: true,
      title: options.title ?? initialState.title,
      description: options.description ?? initialState.description,
      confirmText: options.confirmText ?? initialState.confirmText,
      cancelText: options.cancelText ?? initialState.cancelText,
      variant: options.variant ?? initialState.variant,
    });
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const value = useMemo<ConfirmContextValue>(() => ({ confirm }), [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
     <Modal
  open={state.open}
  title={state.title}
  subtitle={undefined}
  onClose={() => close(false)}
  maxWidthClassName="max-w-md"
  footer={
    <div className="flex items-center justify-end gap-3">
      <Button variant="secondary" onClick={() => close(false)}>
        {state.cancelText}
      </Button>
      <Button
        variant={state.variant === 'danger' ? 'danger' : 'accent'}
        onClick={() => close(true)}
      >
        {state.confirmText}
      </Button>
    </div>
  }
>
  {state.description && (
    <p className="text-sm text-white/60">
      {state.description}
    </p>
  )}
</Modal>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ConfirmContextValue => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
};
