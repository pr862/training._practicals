import api from './api';
import type { ApiResponse, Artist } from '../types/api';

export const artistService = {
  getAll: (): Promise<ApiResponse<Artist[]>> => api.get('/user/artists'),
  getById: (id: string): Promise<ApiResponse<Artist>> => api.get(`/user/artists/${id}`),
};
