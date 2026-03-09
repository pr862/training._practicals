import type { Category } from './category';

export interface Product {
  id: number;
  productNumber: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
  categoryId: number;
  admin_id?: number | null;
  Category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductQuery {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface ProductUpsertInput {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  image?: File;
}
