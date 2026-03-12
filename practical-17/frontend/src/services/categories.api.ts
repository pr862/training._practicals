import { apiClient } from '@/services/http';
import type { Category, CategoryPayload } from '@/types';

interface CategoryApiResponse {
  id: number | string;
  name: string;
  parent_id: number | string | null;
  adminId?: number | string;
  admin_id?: number | string | null;
  createdAt?: string;
  updatedAt?: string;
}

const normalizeCategory = (category: CategoryApiResponse): Category => ({
  id: Number(category.id),
  name: category.name,
  parent_id: category.parent_id !== null ? Number(category.parent_id) : null,
  admin_id: category.adminId !== undefined ? Number(category.adminId) : (category.admin_id !== undefined ? Number(category.admin_id) : undefined),
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

export const categoryAPI = {
  async getAll(adminId?: number): Promise<Category[]> {
    const params = adminId ? { adminId } : {};
    const { data } = await apiClient.get<CategoryApiResponse[]>('/api/categories', { params });
    return data.map(normalizeCategory);
  },
  async getAdminCategories(): Promise<Category[]> {
    const { data } = await apiClient.get<CategoryApiResponse[]>('/api/admin/categories');
    return data.map(normalizeCategory);
  },
  async getById(id: number): Promise<Category> {
    const { data } = await apiClient.get<CategoryApiResponse>(`/api/categories/${id}`);
    return normalizeCategory(data);
  },
  async create(payload: CategoryPayload): Promise<Category> {
    const { data } = await apiClient.post<CategoryApiResponse>('/api/categories', payload);
    return normalizeCategory(data);
  },
  async update(id: number, payload: CategoryPayload): Promise<Category> {
    const { data } = await apiClient.put<CategoryApiResponse>(`/api/categories/${id}`, payload);
    return normalizeCategory(data);
  },
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/categories/${id}`);
  },
};
