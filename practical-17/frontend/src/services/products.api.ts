import { apiClient } from '@/services/http';
import type { Category, Product, ProductQuery, ProductUpsertInput } from '@/types';

interface ProductApiResponse {
  id: number | string;
  name: string;
  price: number | string;
  stock: number | string;
  image?: string;
  categoryId?: number | string;
  category_id?: number | string;
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

const toFormData = (payload: ProductUpsertInput | Partial<ProductUpsertInput>) => {
  const formData = new FormData();
  if (payload.name !== undefined) formData.append('name', payload.name);
  if (payload.price !== undefined) formData.append('price', payload.price.toString());
  if (payload.stock !== undefined) formData.append('stock', payload.stock.toString());
  if (payload.categoryId !== undefined) formData.append('categoryId', payload.categoryId.toString());
  if (payload.image) formData.append('image', payload.image);
  return formData;
};

export const productAPI = {
  async getAll(params?: ProductQuery & { adminId?: number }): Promise<Product[]> {
    const { data } = await apiClient.get<ProductApiResponse[]>('/api/products', { params });
    return data.map(normalizeProduct);
  },
  async getAdminProducts(): Promise<Product[]> {
    const { data } = await apiClient.get<ProductApiResponse[]>('/api/admin/products');
    return data.map(normalizeProduct);
  },
  async getById(id: number): Promise<Product> {
    const { data } = await apiClient.get<ProductApiResponse>(`/api/products/${id}`);
    return normalizeProduct(data);
  },
  async create(payload: ProductUpsertInput): Promise<Product> {
    const { data } = await apiClient.post<ProductApiResponse>('/api/products', toFormData(payload), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return normalizeProduct(data);
  },
  async update(id: number, payload: Partial<ProductUpsertInput>): Promise<Product> {
    const { data } = await apiClient.put<ProductApiResponse>(`/api/products/${id}`, toFormData(payload), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return normalizeProduct(data);
  },
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/products/${id}`);
  },
};
