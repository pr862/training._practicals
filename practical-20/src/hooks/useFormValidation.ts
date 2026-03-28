import { useState, useCallback } from 'react';

export type ValidationRules<T> = {
  [K in keyof T]?: (value: T[K]) => string | undefined;
};

export type ValidationErrors<T> = {
  [K in keyof T]?: string;
};

export const useFormValidation = <T extends Record<string, any>>(
  validationRules: ValidationRules<T>
) => {
  const [errors, setErrors] = useState<ValidationErrors<T>>({});

  const validate = useCallback((values: T): boolean => {
    const newErrors: ValidationErrors<T> = {};
    
    Object.keys(validationRules).forEach(key => {
      const rule = validationRules[key as keyof T];
      if (rule) {
        const error = rule(values[key as keyof T]);
        if (error) {
          newErrors[key as keyof T] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validationRules]);

  const clearError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validate,
    clearError,
    setFieldError,
    clearAllErrors
  };
};

export const validationRules = {
  required: (message = 'This field is required') => (value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return message;
    }
    return undefined;
  },
  
  minLength: (min: number, message?: string) => (value: any) => {
    if (value && typeof value === 'string' && value.trim().length < min) {
      return message || `Must be at least ${min} characters long`;
    }
    return undefined;
  },
  
  email: (message = 'Please enter a valid email address') => (value: any) => {
    if (value && !/\S+@\S+\.\S+/.test(value)) {
      return message;
    }
    return undefined;
  },
  
  password: (message = 'Password must be at least 8 characters with uppercase, lowercase, and numbers') => (value: any) => {
    if (value && value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return 'Password must contain uppercase, lowercase, and numbers';
    }
    return undefined;
  },
  
  confirmPassword: (password: string, message = 'Passwords do not match') => (value: any) => {
    if (value !== password) {
      return message;
    }
    return undefined;
  },
  
  fileSize: (maxSize: number, message?: string) => (file: File | null) => {
    if (file && file.size > maxSize) {
      return message || `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`;
    }
    return undefined;
  },
  
  imageDimensions: (maxWidth: number, maxHeight: number, message = 'Image dimensions are too large') => (file: File | null) => {
    return new Promise<string | undefined>((resolve) => {
      if (!file) {
        resolve(undefined);
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        if (img.width > maxWidth || img.height > maxHeight) {
          resolve(message);
        } else {
          resolve(undefined);
        }
      };
      img.onerror = () => resolve('Invalid image file');
      img.src = URL.createObjectURL(file);
    });
  }
};