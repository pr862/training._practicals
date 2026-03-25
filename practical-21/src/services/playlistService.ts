import api from './api';
import type { ApiResponse, Playlist } from '../types/api';

export const playlistService = {
  getAll: async (): Promise<ApiResponse<Playlist[]>> => {
    const res = await api.get<ApiResponse<Playlist[]>>('/user/playlists');
    return res.data;
  },
  create: async (data: Omit<Playlist, 'id'>): Promise<ApiResponse<Playlist>> => {
    const res = await api.post<ApiResponse<Playlist>>('/user/playlists', data);
    return res.data;
  },
  addTrack: async (id: string, trackId: string): Promise<ApiResponse<Playlist>> => {
    const res = await api.post<ApiResponse<Playlist>>(`/user/playlists/${id}/tracks${trackId}`);
    return res.data;
  },
  removeTrack: async (id: string, trackId: string): Promise<ApiResponse<Playlist>> => {
    const res = await api.delete<ApiResponse<Playlist>>(`/user/playlists/${id}/tracks/${trackId}`);
    return res.data;
  },
};
