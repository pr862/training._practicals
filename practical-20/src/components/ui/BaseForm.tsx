import React from 'react';
import { Button } from './Button';

interface BaseFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
  submitText: string;
  cancelText?: string; 
  onCancel?: () => void; 
  fullWidthButton?: boolean;
  className?: string;
}

export const BaseForm: React.FC<BaseFormProps> = ({
  children,
  onSubmit,
  isLoading = false,
  submitText,
  cancelText,
  onCancel,
  fullWidthButton = false,
  className = 'space-y-6'
}) => {
  return (
    <form onSubmit={onSubmit} className={className}>
      {children}
      
      <div className={`flex gap-3 pt-4 ${
        fullWidthButton 
          ? 'flex-col' 
          : 'items-center justify-end border-t border-white/10'
      }`}>
        
        {onCancel && cancelText && (
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel} 
            disabled={isLoading}
            className={fullWidthButton ? 'w-full' : ''}
          >
            {cancelText}
          </Button>
        )}

        <Button 
          type="submit" 
          variant="accent" 
          disabled={isLoading}
          className={fullWidthButton ? 'w-full' : ''}
        >
          {isLoading ? 'Processing...' : submitText}
        </Button>
      </div>
    </form>
  );
};

interface FormSectionProps {
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({ 
  children, 
  className = 'grid gap-4 md:grid-cols-2' 
}) => {
  return <div className={className}>{children}</div>;
};

interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ 
  children, 
  className = 'md:col-span-2' 
}) => {
  return <div className={className}>{children}</div>;
};