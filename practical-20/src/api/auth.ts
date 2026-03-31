import { api } from './http';
import type { AuthResponse } from '../types/auth';

export const adminAuthApi = {
  login(email: string, password: string): Promise<AuthResponse> {
    return api.json<AuthResponse>('/auth/admin/login', {
      method: 'POST',
      body: { email, password },
    });
  },
  register(name: string, email: string, password: string): Promise<AuthResponse> {
    return api.json<AuthResponse>('/auth/admin/register', {
      method: 'POST',
      body: { name, email, password },
    });
  },
};

