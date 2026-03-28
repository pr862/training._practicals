import React from 'react';
import { cx } from './utils';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

export const Select: React.FC<SelectProps> = ({ label, error, className, id, children, ...props }) => {
  const selectId = id ?? React.useId();
  return (
    <label className={cx('grid gap-1 text-sm', className)} htmlFor={selectId}>
      {label ? <span className="font-medium text-white/80">{label}</span> : null}
      <select
        id={selectId}
        className={cx(
          'h-11 rounded-xl border border-white/10 bg-neutral-900/90 px-4 text-sm text-white shadow-sm transition-all duration-200 focus:border-teal-400/60 focus:outline-none focus:ring-4 focus:ring-teal-400/15',
          error ? 'border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/15' : null
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-rose-400">{error}</span> : null}
    </label>
  );
};
