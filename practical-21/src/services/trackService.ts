import api from './api';
import type { ApiResponse, Track } from '../types/api';

export const trackService = {
  getAll: (): Promise<ApiResponse<Track[]>> => api.get('/tracks'),
  getById: (id: string): Promise<ApiResponse<Track>> => api.get(`/tracks/${id}`),
  search: (query: string): Promise<ApiResponse<Track[]>> => api.get('/tracks?search=' + encodeURIComponent(query)), // Assume backend supports
};
