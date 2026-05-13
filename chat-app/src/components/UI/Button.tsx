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
  const baseClasses ='inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60';

  const variants: Record<string, string> = {
    primary: 'text-white shadow-lg hover:shadow-blue-700/25 bg-gradient-to-br from-cyan-900 to-blue-900 hover:brightness-105',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm hover:shadow-md hover:brightness-105',
    outline: 'bg-transparent border-2 border-blue-500 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    accent: 'text-white text-sm shadow-md bg-gradient-to-r from-blue-400 to-blue-600 hover:brightness-105',
  };

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
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
