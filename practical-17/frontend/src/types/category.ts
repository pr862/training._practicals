export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryPayload {
  name: string;
  parent_id?: number | null;
}
