import React, { forwardRef,type ReactNode } from 'react';
import { cx } from './utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  labelClassName?: string;
  inputClassName?: string;
  error?: string;
  errorClassName?: string;
  icon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, labelClassName, inputClassName, errorClassName, id, icon, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className={cx('grid gap-1.5 text-sm', className)}>
        {label ? (
          <label htmlFor={inputId} className={cx('font-medium text-gray-700', labelClassName)}>
            {label}
          </label>
        ) : null}

        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center justify-center text-slate-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={cx(
              'h-11 w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-800/10 disabled:cursor-not-allowed disabled:opacity-60 hover:border-gray-400',
              icon ? 'pl-11 pr-4' : 'px-4', 
              error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/10' : null,
              inputClassName
            )}
            {...props}
          />
        </div>

        {error ? (
          <span className={cx('text-xs font-medium text-rose-600', errorClassName)}>{error}</span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
