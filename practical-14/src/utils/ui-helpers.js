export function showError(errorBox, message) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
}
export function hideError(errorBox) {
    errorBox.classList.add('hidden');
}
export function clearError(errorBox) {
    errorBox.textContent = '';
    errorBox.classList.add('hidden');
}
export function showSuccess(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
    element.classList.add('text-green-600', 'bg-green-50', 'border', 'border-green-200');
}
export function hideSuccess(element) {
    element.classList.add('hidden');
    element.classList.remove('text-green-600', 'bg-green-50', 'border', 'border-green-200');
}
export function validateField(condition, errorBox, errorMessage) {
    if (!condition) {
        showError(errorBox, errorMessage);
        return false;
    }
    return true;
}
export function getFormElement(id) {
    return document.getElementById(id);
}
export function getInputElement(id) {
    return document.getElementById(id);
}
export function setLoadingState(mainContent, loading) {
    if (loading) {
        mainContent?.classList.add('hidden');
    }
    else {
        mainContent?.classList.remove('hidden');
    }
}
export function navigateTo(page) {
    window.location.href = page;
}
export async function handleLogout(logoutUser) {
    await logoutUser();
    window.location.href = 'login.html';
}
let authInitialized = false;
export function setupAuthHandler(onAuthChange, subscribeToAuth) {
    authInitialized = false;
    return subscribeToAuth(async (user) => {
        if (!authInitialized) {
            authInitialized = true;
            await onAuthChange(user);
        }
    });
}
export function showToastError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    setTimeout(() => {
        errorElement.classList.add('hidden');
    }, 5000);
}
export function showToastSuccess(successElement, message) {
    successElement.textContent = message;
    successElement.classList.remove('hidden');
    setTimeout(() => {
        successElement.classList.add('hidden');
    }, 5000);
}
