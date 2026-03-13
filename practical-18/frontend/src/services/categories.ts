import { apiClient } from '@/services/http';
import type { Category } from '@/types';

interface CategoryApiResponse {
  id: number;
  name: string;
  parent_id: number | null;
  createdAt?: string;
  updatedAt?: string;
}

const normalizeCategory = (category: CategoryApiResponse): Category => ({
  id: Number(category.id),
  name: category.name,
  parent_id: category.parent_id !== null ? Number(category.parent_id) : null,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

export const categoryAPI = {
  async getAll(): Promise<Category[]> {
    const { data } = await apiClient.get<CategoryApiResponse[]>('/api/categories');
    return data.map(normalizeCategory);
  },
  async getById(id: number): Promise<Category> {
    const { data } = await apiClient.get<CategoryApiResponse>(`/api/categories/${id}`);
    return normalizeCategory(data);
  },
};
