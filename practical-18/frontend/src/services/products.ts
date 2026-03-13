import { apiClient } from '@/services/http';
import type { Category, Product, ProductQuery } from '@/types';

interface ProductApiResponse {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
  categoryId?: number;
  category_id?: number;
  Category?: Category;
  category?: Category;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
}

export const normalizeProduct = (item: ProductApiResponse): Product => ({
  id: Number(item.id),
  name: item.name,
  price: Number(item.price ?? 0),
  stock: Number(item.stock ?? 0),
  image: item.image,
  categoryId: Number(item.categoryId ?? item.category_id ?? item.Category?.id ?? item.category?.id ?? 0),
  Category: item.Category ?? item.category,
  createdAt: item.createdAt ?? item.created_at,
  updatedAt: item.updatedAt,
});

export const productAPI = {
  async getAll(params?: ProductQuery): Promise<Product[]> {
    const { data } = await apiClient.get<ProductApiResponse[]>('/api/products', { params });
    return data.map(normalizeProduct);
  },
  async getById(id: number): Promise<Product> {
    const { data } = await apiClient.get<ProductApiResponse>(`/api/products/${id}`);
    return normalizeProduct(data);
  },
};
