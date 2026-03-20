import api from './api';
import type { ApiResponse, Playlist } from '../types/api';

export const playlistService = {
  getAll: (): Promise<ApiResponse<Playlist[]>> => api.get('/user/playlists'),
  create: (data: Omit<Playlist, 'id'>): Promise<ApiResponse<Playlist>> => api.post('/user/playlists', data),
  addTrack: (id: string, trackId: string): Promise<ApiResponse<Playlist>> => api.post(`/user/playlists/${id}/tracks`, { trackId }),
  removeTrack: (id: string, trackId: string): Promise<ApiResponse<Playlist>> => api.delete(`/user/playlists/${id}/tracks/${trackId}`),
};
