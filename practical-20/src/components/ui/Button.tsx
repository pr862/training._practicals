import React from 'react';
import { cx } from './utils';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'accent';
export type ButtonSize = 'sm' | 'md';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  type,
  disabled,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer';
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
  };
  const styles: Record<ButtonVariant, string> = {
    primary: 'bg-white/10 text-white hover:bg-white/15 border border-white/10 shadow-sm hover:shadow-md',
    secondary: 'bg-transparent border border-white/15 text-white/80 hover:bg-white/5 hover:text-white',
    danger: 'bg-[linear-gradient(135deg,#f07470,#ea4c46)] text-white shadow-sm hover:shadow-md',
    accent:
      'text-white shadow-lg hover:shadow-teal-500/10 bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 hover:brightness-110',
  };

  return (
    <button
      type={type ?? 'button'}
      className={cx(base, sizes[size], styles[variant], className)}
      disabled={disabled}
      {...props}
    />
  );
};
