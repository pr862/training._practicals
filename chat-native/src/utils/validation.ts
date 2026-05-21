export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'Email is required.'
  if (!emailRegex.test(email)) return 'Please enter a valid email address.'
  return ''
}

export const validatePassword = (password: string): string => {
  if (!password) return 'Password is required.'
  if (password.length < 8) return 'Password must be at least 8 characters long.'
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter.'
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter.'
  if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number.'
  return ''
}

export const validateName = (name: string): string => {
  if (!name || !name.trim()) return 'Full name is required.'
  if (name.length < 2) return 'Full name must be at least 2 characters long.'
  return ''
}

export const validateConfirmPassword = (confirmPassword: string, password: string): string => {
  if (!confirmPassword) return 'Please confirm your password.'
  if (confirmPassword !== password) return 'Passwords do not match.'
  return ''
}

export const validateProfileImage = (file: { type?: string; size?: number } | null): string => {
  if (!file) return "";
  const maxSize = 2 * 1024 * 1024;
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (file.type && !allowedTypes.includes(file.type)) {
    return "Please select a valid image (JPG, PNG, or WebP).";
  }
  if (file.size && file.size > maxSize) {
    return "Image must be smaller than 2 MB.";
  }
  return "";
};
