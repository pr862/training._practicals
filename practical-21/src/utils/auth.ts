export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const getUser = <TUser = unknown>(): TUser | null => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw) as TUser;
  } catch {
    return null;
  }
};

export const setUser = (user: unknown): void => {
  try {
    localStorage.setItem('user', JSON.stringify(user));
  } catch {
  }
};

export const removeUser = (): void => {
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
