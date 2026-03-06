import { apiClient } from '@/services/http';
import { normalizeProduct } from '@/services/products.api';
import type { FavoriteStatus, FeedbackInput, Product } from '@/types';

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
