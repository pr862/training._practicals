import { apiClient } from '@/services/http';
import { normalizeProduct } from '@/services/products.api';
import type { AdminUser, Analytics, FavoriteStatus, FeedbackInput, Product } from '@/types';

interface RawAdminUser {
  id: number | string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

const normalizeAdminUser = (user: RawAdminUser): AdminUser => ({
  id: Number(user.id),
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const adminUserAPI = {
  async getAll(): Promise<AdminUser[]> {
    const { data } = await apiClient.get<RawAdminUser[]>('/api/admin/users');
    return data.map(normalizeAdminUser);
  },
  async getById(id: number): Promise<AdminUser> {
    const { data } = await apiClient.get<RawAdminUser>(`/api/admin/users/${id}`);
    return normalizeAdminUser(data);
  },
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/users/${id}`);
  },
};

export const analyticsAPI = {
  async get(): Promise<Analytics> {
    const { data } = await apiClient.get<Analytics>('/api/admin/analytics');
    return data;
  },
};

export const userAPI = {
  async getFavorites(): Promise<Product[]> {
    const { data } = await apiClient.get<any[]>('/api/user/favorites');
    return data.map(normalizeProduct);
  },
  async addFavorite(productId: number): Promise<void> {
    await apiClient.post(`/api/user/favorites/${productId}`);
  },
  async removeFavorite(productId: number): Promise<void> {
    await apiClient.delete(`/api/user/favorites/${productId}`);
  },
  async checkFavorite(productId: number): Promise<boolean> {
    const { data } = await apiClient.get<FavoriteStatus>(`/api/user/favorites/${productId}/check`);
    return data.isFavorited;
  },
  async sendFeedback(payload: FeedbackInput): Promise<void> {
    await apiClient.post('/api/user/feedback', payload);
  },
};
