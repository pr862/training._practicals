import { apiClient } from '@/services/http';
import type { AuthSession, LoginInput, RegisterInput, UserRole } from '@/types';

const signup = async (payload: RegisterInput & { role: UserRole }): Promise<AuthSession> => {
  const { data } = await apiClient.post<AuthSession>('/api/auth/signup', payload);
  return data;
};

export const authAPI = {
  async login(payload: LoginInput): Promise<AuthSession> {
    const { data } = await apiClient.post<AuthSession>('/api/auth/login', payload);
    return data;
  },
  async registerAdmin(payload: RegisterInput): Promise<AuthSession> {
    return signup({ ...payload, role: 'admin' });
  },
  async registerUser(payload: RegisterInput): Promise<AuthSession> {
    return signup({ ...payload, role: 'user' });
  },
};
