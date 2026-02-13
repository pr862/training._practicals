import { loginUser } from './auth.js';
import { showError } from '../utils/ui-helpers.js';
import { getFirebaseAuthErrorMessage } from './auth.js';
import { isValidEmail } from '../utils/validation.js';
const form = document.getElementById('loginForm');
const email = document.getElementById('email');
const password = document.getElementById('password');
const errorBox = document.getElementById('errorMessage');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.classList.add('hidden');
    const emailValue = email.value.trim();
    const passwordValue = password.value;
    if (!emailValue) {
        showError(errorBox, 'Please enter your email address');
        return;
    }
    if (!isValidEmail(emailValue)) {
        showError(errorBox, 'Please enter a valid email address (e.g., user@example.com)');
        return;
    }
    if (!passwordValue) {
        showError(errorBox, 'Please enter your password');
        return;
    }
    try {
        await loginUser(emailValue, passwordValue);
        window.location.href = 'dashboard.html';
    }
    catch (error) {
        const errorMessage = getFirebaseAuthErrorMessage(error.code);
        showError(errorBox, errorMessage);
    }
});
