import api from './api';
import type { User } from '../types/api';

export const loginUser = async (credentials: { email: string; password: string }): Promise<{ user: User; token: string }> => {
  const response = await api.post('/auth/user/login', credentials);
  if (!response.data.user || !response.data.token) {
    throw new Error(response.data.message || 'Login failed');
  }
  return { user: response.data.user, token: response.data.token };
};

export const registerUser = async (userData: { username: string; email: string; password: string }): Promise<{ token: string }> => {
  const response = await api.post('/auth/user/register', { name: userData.username, email: userData.email, password: userData.password });
  if (!response.data.token) {
    throw new Error(response.data.message || 'Registration failed');
  }
  return { token: response.data.token };
};

