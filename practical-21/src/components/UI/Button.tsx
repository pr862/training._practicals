import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer';

  const variants: Record<string, string> = {
    primary:
      'text-white shadow-lg hover:shadow-teal-500/10 bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 hover:brightness-110',
    secondary:
      'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500',
    danger:
      'bg-[linear-gradient(135deg,#f07470,#ea4c46)] text-white shadow-sm hover:shadow-md',
    outline:
      'bg-transparent border-2 border-teal-500 text-teal-600 hover:bg-teal-900 hover:text-white focus:ring-teal-500',
    accent:
      'text-white  text-sm shadow-lg hover:shadow-teal-500/10 bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 hover:brightness-110',
  };

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const buttonClassName = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`.trim();

  return (
    <button className={buttonClassName} {...props}>
      {icon && iconPosition === 'left' && <span className="flex items-center">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="flex items-center">{icon}</span>}
    </button>
  );
};

export default Button;