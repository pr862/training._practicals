import React, { type ButtonHTMLAttributes } from 'react';
// import { cn } from '../../../utils/cn'; // cva or clsx based class merge util

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'| 'accent';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 inline-flex items-center justify-center';
  
  const variants = {
    primary: 'bg-gradient-to-br from-teal-500 to-teal-800  text-white hover:from-teal-700 hover:to-teal-700 focus:ring-teal-500 shadow-lg',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    outline: 'bg-transparent border-2 border-teal-500 hover:bg-teal-900 text-teal-600 hover:bg-teal-900 focus:ring-purple-500 ',
    accent: 'bg-gradient-to-br from-teal-500 to-teal-800  hover:bg-pink-800 text-white',

  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const buttonClassName = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className || ''}`.trim();

  return (
    <button
      className={buttonClassName}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
