import { registerUser, getFirebaseAuthErrorMessage } from './auth.js';
import { isValidEmail, validatePasswordStrength } from '../utils/validation.js';
import { showError } from '../utils/ui-helpers.js';

const form = document.getElementById('registerForm') as HTMLFormElement;
const email = document.getElementById('email') as HTMLInputElement;
const password = document.getElementById('password') as HTMLInputElement;
const confirm = document.getElementById('confirmPassword') as HTMLInputElement;
const name = document.getElementById('displayName') as HTMLInputElement;
const errorBox = document.getElementById('errorMessage') as HTMLDivElement;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.classList.add('hidden');

  const nameValue = name.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = password.value;
  const confirmValue = confirm.value;

  if (!nameValue) {
    showError(errorBox, 'Please enter your name');
    return;
  }
  if (nameValue.length < 2) {
    showError(errorBox, 'Name must be at least 2 characters long');
    return;
  }

  if (!emailValue) {
    showError(errorBox, 'Please enter your email address');
    return;
  }
  if (!isValidEmail(emailValue)) {
    showError(errorBox, 'Please enter a valid email address (e.g., user@example.com)');
    return;
  }

  if (!passwordValue) {
    showError(errorBox, 'Please create a password');
    return;
  }
  const passwordValidation = validatePasswordStrength(passwordValue);
  if (!passwordValidation.valid) {
    showError(errorBox, passwordValidation.message);
    return;
  }

  if (!confirmValue) {
    showError(errorBox, 'Please confirm your password');
    return;
  }
  if (passwordValue !== confirmValue) {
    showError(errorBox, 'Passwords do not match');
    return;
  }

  try {
    await registerUser(emailValue, passwordValue, nameValue);
    window.location.href = 'dashboard.html';
  } catch (error: any) {
    const errorMessage = error.code ? getFirebaseAuthErrorMessage(error.code) : (error.message || 'An error occurred. Please try again.');
    showError(errorBox, errorMessage);
  }
});
