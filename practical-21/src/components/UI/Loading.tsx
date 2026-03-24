import React from 'react';

type Props = {
  label?: string;
  fullScreen?: boolean;
  className?: string;
};

const Loading: React.FC<Props> = ({ label = 'Loading...', fullScreen = false, className = '' }) => {
  return (
    <div className={`${fullScreen ? 'min-h-[60vh]' : ''} flex items-center justify-center py-8 ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-teal-400" />
      <span className="ml-3 text-sm text-white/70">{label}</span>
    </div>
  );
};

export default Loading;
