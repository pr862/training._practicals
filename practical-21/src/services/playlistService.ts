import api from './api';
import type { ApiResponse, Playlist } from '../types/api';

export const playlistService = {
  getAll: (): Promise<ApiResponse<Playlist[]>> => api.get('/playlists'),
  create: (data: Omit<Playlist, 'id'>): Promise<ApiResponse<Playlist>> => api.post('/playlists', data),
  addTrack: (id: string, trackId: string): Promise<ApiResponse<Playlist>> => api.post(`/playlists/${id}/tracks`, { trackId }),
  removeTrack: (id: string, trackId: string): Promise<ApiResponse<Playlist>> => api.delete(`/playlists/${id}/tracks/${trackId}`),
};
