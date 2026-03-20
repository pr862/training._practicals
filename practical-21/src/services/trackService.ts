import api from './api';
import type { ApiResponse, Track } from '../types/api';

export const trackService = {
  getAll: (): Promise<ApiResponse<Track[]>> => api.get('/user/tracks'),
  getById: (id: string): Promise<ApiResponse<Track>> => api.get(`/user/tracks/${id}`),
  search: (query: string): Promise<ApiResponse<Track[]>> => api.get('/user/tracks?search=' + encodeURIComponent(query)),
  getByArtist: (artistId: string): Promise<{data: ApiResponse<Track[]>}> => api.get(`/user/artists/${artistId}/tracks`),
};
