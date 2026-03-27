import { useState } from 'react';

export type ValidationRule = (value: string) => string | undefined;

export const validationRules = {
  required: (message: string = 'This field is required') => (value: string) => {
    if (!value || value.trim() === '') return message;
    return undefined;
  },
  email: (message: string = 'Please enter a valid email address') => (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) return message;
    return undefined;
  },
  minLength: (min: number, message?: string) => (value: string) => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters long`;
    }
    return undefined;
  },
  maxLength: (max: number, message?: string) => (value: string) => {
    if (value && value.length > max) {
      return message || `Must be no more than ${max} characters long`;
    }
    return undefined;
  },
  pattern: (regex: RegExp, message: string = 'Invalid format') => (value: string) => {
    if (value && !regex.test(value)) return message;
    return undefined;
  },
};

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (data: { [key: string]: string }): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach((field) => {
      const value = data[field] || '';
      const error = rules[field](value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validate,
    clearError,
    clearAllErrors,
  };
};