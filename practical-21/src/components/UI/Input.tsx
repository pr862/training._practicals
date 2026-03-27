import React, { forwardRef } from 'react';
import { cx } from './utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  labelClassName?: string;
  inputClassName?: string;
  hint?: string;
  hintClassName?: string;
  error?: string;
  errorClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  hint,
  error,
  className,
  labelClassName,
  inputClassName,
  hintClassName,
  errorClassName,
  id,
  ...props
}, ref) => {
  const inputId = id ?? React.useId();
  return (
    <label className={cx('grid gap-1.5 text-sm', className)} htmlFor={inputId}>
      {label ? (
        <span className={cx('font-medium text-white/80', labelClassName)}>{label}</span>
      ) : null}
      <input
        ref={ref}
        id={inputId}
        className={cx(
          'h-11 rounded-xl border border-white/10 bg-neutral-900/60 px-4 text-sm text-white shadow-sm transition-all duration-200 placeholder:text-white/35 focus:border-teal-400/60 focus:outline-none focus:ring-4 focus:ring-teal-400/15 disabled:cursor-not-allowed disabled:opacity-60 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white/80 hover:file:bg-white/15 hover:border-white/20',
          error ? 'border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/15' : null,
          inputClassName
        )}
        {...props}
      />
      {hint ? <span className={cx('text-xs text-white/45', hintClassName)}>{hint}</span> : null}
      {error ? <span className={cx('text-xs text-rose-400', errorClassName)}>{error}</span> : null}
    </label>
  );
});

Input.displayName = 'Input';
