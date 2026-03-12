import { apiClient } from '@/services/http';
import type { AuthSession, LoginInput, RegisterInput } from '@/types';

const signupUser = async (payload: RegisterInput & { role: 'user' }): Promise<AuthSession> => {
  const { data } = await apiClient.post<AuthSession>('/api/auth/signup', payload);
  return data;
};

export const authAPI = {
  async login(payload: LoginInput): Promise<AuthSession> {
    const { data } = await apiClient.post<AuthSession>('/api/auth/login', payload);
    return data;
  },
  async registerUser(payload: RegisterInput): Promise<AuthSession> {
    return signupUser({ ...payload, role: 'user' });
  },
};
