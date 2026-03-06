export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();
export const normalizeName = (name: string): string => name.trim();

export const validateRegisterForm = (formData: RegisterFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  const namePattern = /^[A-Za-z][A-Za-z\s'-]*$/;

  const name = normalizeName(formData.name);
  const email = normalizeEmail(formData.email);
  const password = formData.password;
  const confirmPassword = formData.confirmPassword;

  if (!name) {
    errors.name = 'Name is required';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (name.length > 50) {
    errors.name = 'Name must not exceed 50 characters';
  } else if (!namePattern.test(name)) {
    errors.name = 'Name can contain only letters, spaces, apostrophes, and hyphens';
  }

  if (!email) {
    errors.email = 'Email is required';
  } else if (!emailPattern.test(email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (password.length > 64) {
    errors.password = 'Password must not exceed 64 characters';
  } else if (/\s/.test(password)) {
    errors.password = 'Password must not contain spaces';
  } else if (!/[a-z]/.test(password)) {
    errors.password = 'Password must contain at least one lowercase letter';
  } else if (!/[A-Z]/.test(password)) {
    errors.password = 'Password must contain at least one uppercase letter';
  } else if (!/\d/.test(password)) {
    errors.password = 'Password must contain at least one number';
  } else if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~+=;]/.test(password)) {
    errors.password = 'Password must contain at least one special character';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateLoginForm = (formData: LoginFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  const email = normalizeEmail(formData.email);
  const password = formData.password;

  if (!email) {
    errors.email = 'Email is required';
  } else if (email.length > 100) {
    errors.email = 'Email must not exceed 100 characters';
  } else if (!emailPattern.test(email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  } else if (password.length > 128) {
    errors.password = 'Password must not exceed 128 characters';
  }

  return errors;
};
