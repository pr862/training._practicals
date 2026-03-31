import React from 'react';
import { cx } from './utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea: React.FC<TextareaProps> = ({ label, error, className, id, ...props }) => {
  const textareaId = id ?? React.useId();
  return (
    <label className={cx('grid gap-1 text-sm', className)} htmlFor={textareaId}>
      {label ? <span className="font-medium text-white/80">{label}</span> : null}
      <textarea
        id={textareaId}
        className={cx(
          'min-h-10 rounded-xl border border-white/10 bg-neutral-900/60 px-4 py-3 text-sm text-white shadow-sm transition-all duration-200 placeholder:text-white/35 focus:border-teal-400/60 focus:outline-none focus:ring-4 focus:ring-teal-400/15',
          error ? 'border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/15' : null
        )}
        {...props}
      />
      {error ? <span className="text-xs text-rose-400">{error}</span> : null}
    </label>
  );
};
