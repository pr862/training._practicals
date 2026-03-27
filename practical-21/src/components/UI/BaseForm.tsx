import React from 'react';
import Button from './Button';

interface BaseFormProps {
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitText: string;
  fullWidthButton?: boolean;
  cancelText?: string;
  onCancel?: () => void;
  children: React.ReactNode;
}

export const BaseForm: React.FC<BaseFormProps> = ({
  onSubmit,
  isLoading = false,
  submitText,
  fullWidthButton = false,
  cancelText,
  onCancel,
  children,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {children}
      
      <div className="flex gap-3">
        <Button
          type="submit"
          variant="accent"
          className={`h-11 ${fullWidthButton ? 'w-full' : 'flex-1'} rounded-full`}
          disabled={isLoading}
        >
          {isLoading ? 'Processing…' : submitText}
        </Button>
        
        {cancelText && onCancel && (
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 rounded-full"
            onClick={onCancel}
          >
            {cancelText}
          </Button>
        )}
      </div>
    </form>
  );
};

export const FormField: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="space-y-2">{children}</div>;
};