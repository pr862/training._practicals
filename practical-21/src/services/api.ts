import axios from 'axios';
import type { ApiResponse } from '../types/api';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

import { getToken } from '../utils/auth';

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import { addResponseInterceptor } from '../utils/errorHandler';

addResponseInterceptor(api);

export default api;



export const tracksAPI = {
  getAll: () => api.get<ApiResponse<any[]>>('/user/tracks'),
};

export const artistsAPI = {
  getAll: () => api.get<ApiResponse<any[]>>('/user/artists'),
};

export const albumsAPI = {
  getAll: () => api.get<ApiResponse<any[]>>('/user/albums'),
};

export const playlistsAPI = {
  getAll: () => api.get<ApiResponse<any[]>>('/user/playlists'),
};

export const favouritesAPI = {
  getAll: () => api.get<ApiResponse<any[]>>('/user/favourites'),
  add: (trackId: string) => api.post('/user/favourites', { trackId }),
};
