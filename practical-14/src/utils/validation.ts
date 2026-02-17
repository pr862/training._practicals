export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePasswordStrength(password: string): { valid: boolean; message: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter (A-Z)' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter (a-z)' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number (0-9)' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character (!@#$%^&*...)' };
  }
  return { valid: true, message: '' };
}

export function validateNotEmpty(value: string, fieldName: string): { valid: boolean; message: string } {
  if (!value.trim()) {
    return { valid: false, message: `Please enter your ${fieldName}` };
  }
  return { valid: true, message: '' };
}

export function validateMinLength(value: string, minLength: number, fieldName: string): { valid: boolean; message: string } {
  if (value.trim().length < minLength) {
    return { valid: false, message: `${fieldName} must be at least ${minLength} characters long` };
  }
  return { valid: true, message: '' };
}

export function validatePasswordMatch(password: string, confirmPassword: string): { valid: boolean; message: string } {
  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match' };
  }
  return { valid: true, message: '' };
}

