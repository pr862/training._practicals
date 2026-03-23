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
    'font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 inline-flex items-center justify-center gap-2';

  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-br from-teal-500 to-teal-800 text-white hover:from-teal-600 hover:to-teal-700 focus:ring-teal-500 shadow-lg',
    secondary:
      'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline:
      'bg-transparent border-2 border-teal-500 text-teal-600 hover:bg-teal-900 hover:text-white focus:ring-teal-500',
    accent:
      'bg-gradient-to-br from-teal-500 to-teal-800 hover:from-pink-500 hover:to-pink-700 text-white focus:ring-teal-500',
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