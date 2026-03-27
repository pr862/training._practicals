import React from 'react';
import { cx } from './utils';

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
  containerClassName?: string;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  containerClassName,
  className,
  id,
  ...props
}) => {
  const checkboxId = id ?? React.useId();
  return (
    <label className={cx('inline-flex items-center gap-4 text-sm', containerClassName)} htmlFor={checkboxId}>
      <input
        id={checkboxId}
        type="checkbox"
        className={cx(
          'h-4 w-4 rounded border-white/20 bg-neutral-900/90 text-teal-500 focus:ring-teal-400/30',
          className
        )}
        {...props}
      />
      {label ? <span className="text-white/70">{label}</span> : null}
    </label>
  );
};
