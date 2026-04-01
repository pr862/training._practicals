import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md', variant = 'light' }) => {
  if (!isOpen) return null;

  const maxWidth =
    size === 'sm'
      ? 'max-w-sm'
      : size === 'lg'
        ? 'max-w-2xl'
        : size === 'xl'
          ? 'max-w-4xl'
          : 'max-w-md';

  const panelClass =
    variant === 'dark'
      ? 'bg-gray-950 text-white border border-white/10'
      : 'bg-white text-gray-900';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`${panelClass} rounded-xl ${maxWidth} w-full max-h-[90vh] overflow-y-auto shadow-2xl`} onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className={`text-xl font-bold ${variant === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
            <button
              onClick={onClose}
              className={`text-2xl ${variant === 'dark' ? 'text-white/60 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              &times;
            </button>
          </div>
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
