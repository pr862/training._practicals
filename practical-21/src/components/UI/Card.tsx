import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  image?: string;
  hoverEffect?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  image,
  hoverEffect = true,
  shadow = 'md'
}) => {
  const baseClasses = `bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden transition-all duration-300 shadow-${shadow}`;
  const hoverClasses = hoverEffect ? 'group hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-2 hover:bg-white' : '';

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {image && (
        <div className="h-48 w-full bg-gradient-to-br from-gray-900/50 to-transparent relative group-hover:from-purple-500/20">
          <img 
            src={image} 
            alt="" 
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;

