import api from './api';
import type { ApiResponse, Artist } from '../types/api';

export const artistService = {
  getAll: (): Promise<ApiResponse<Artist[]>> => api.get('/artists'),
  getById: (id: string): Promise<ApiResponse<Artist>> => api.get(`/artists/${id}`),
};
