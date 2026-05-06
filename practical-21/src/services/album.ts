import api from './api';
import type { ApiResponse, Album } from '../types/api';

export const albumService = {
  getAll: (): Promise<ApiResponse<Album[]>> => api.get('/user/albums'),
  getById: (id: string): Promise<ApiResponse<Album>> => api.get(`/user/albums/${id}`),
};
