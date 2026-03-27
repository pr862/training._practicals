import React, { useEffect } from 'react';

type ModalProps = React.PropsWithChildren<{
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  footer?: React.ReactNode;
  maxWidthClassName?: string;
}>;

export const Modal: React.FC<ModalProps> = ({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  maxWidthClassName = 'max-w-2xl',
}) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close dialog"
        className="absolute inset-0 h-full w-full bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        type="button"
      />
      <div className="relative mx-auto flex min-h-dvh items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className={[
            'w-full',
            maxWidthClassName,
            'overflow-hidden rounded-2xl border border-teal-100/30 bg-neutral-700 shadow-2xl ring-1 ring-white/5',
          ].join(' ')}
        >
          <div className="border-b border-white/10 px-6 py-5">
            <div className="text-xl font-bold text-white">{title}</div>
            {subtitle ? <div className="mt-1 text-sm text-white/60">{subtitle}</div> : null}
          </div>
          <div className="px-6 py-6">{children}</div>
          {footer ? (
            <div className="border-t border-white/10 px-6 py-4 bg-black/10">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
