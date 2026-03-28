import { api } from '../http';
import type { User } from '../../types/user';

export const adminUsersApi = {
  list(): Promise<User[]> {
    return api.json<User[]>('/admin/users', { method: 'GET' });
  },
};


