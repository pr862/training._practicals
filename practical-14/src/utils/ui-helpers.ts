export function showError(errorBox: HTMLDivElement, message: string): void {
  errorBox.textContent = message;
  errorBox.classList.remove('hidden');
}
export function hideError(errorBox: HTMLDivElement): void {
  errorBox.classList.add('hidden');
}

export function clearError(errorBox: HTMLDivElement): void {
  errorBox.textContent = '';
  errorBox.classList.add('hidden');
}

export function showSuccess(element: HTMLDivElement, message: string): void {
  element.textContent = message;
  element.classList.remove('hidden');
  element.classList.add('text-green-600', 'bg-green-50', 'border', 'border-green-200');
}

export function hideSuccess(element: HTMLDivElement): void {
  element.classList.add('hidden');
  element.classList.remove('text-green-600', 'bg-green-50', 'border', 'border-green-200');
}

export function validateField(
  condition: boolean,
  errorBox: HTMLDivElement,
  errorMessage: string
): boolean {
  if (!condition) {
    showError(errorBox, errorMessage);
    return false;
  }
  return true;
}

export function getFormElement<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

export function getInputElement(id: string): HTMLInputElement | null {
  return document.getElementById(id) as HTMLInputElement | null;
}


export function setLoadingState(mainContent: HTMLElement | null, loading: boolean): void {
  if (loading) {
    mainContent?.classList.add('hidden');
  } else {
    mainContent?.classList.remove('hidden');
  }
}

export function navigateTo(page: string): void {
  window.location.href = page;
}

export async function handleLogout(logoutUser: () => Promise<void>): Promise<void> {
  await logoutUser();
  window.location.href = 'login.html';
}

let authInitialized = false;

export function setupAuthHandler(
  onAuthChange: (user: any) => Promise<void> | void,
  subscribeToAuth: (callback: (user: any) => Promise<void> | void) => () => void
): () => void {
  authInitialized = false;

  return subscribeToAuth(async (user: any) => {
    if (!authInitialized) {
      authInitialized = true;
      await onAuthChange(user);
    }
  });
}

export function showToastError(errorElement: HTMLDivElement, message: string): void {
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');

  setTimeout(() => {
    errorElement.classList.add('hidden');
  }, 5000);
}

export function showToastSuccess(successElement: HTMLDivElement, message: string): void {
  successElement.textContent = message;
  successElement.classList.remove('hidden');

  setTimeout(() => {
    successElement.classList.add('hidden');
  }, 5000);
}

