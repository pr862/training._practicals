import React from 'react';

type Props = {
  fullScreen?: boolean;
  className?: string;
};

const Loading: React.FC<Props> = ({ fullScreen = false, className = '' }) => {
  return (
    <div
      className={`${fullScreen ? 'min-h-[60vh]' : ''} flex items-center justify-center py-8 ${className}`}
      role="status"
      aria-live="polite"
      aria-label="In progress"
    >
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-teal-400" />
    </div>
  );
};

export default Loading;
