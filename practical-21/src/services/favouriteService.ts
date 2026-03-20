import api from './api';
import type { ApiResponse, FavouriteTrack } from '../types/api';

export const favouriteService = {
  getAll: (): Promise<ApiResponse<FavouriteTrack[]>> => api.get('/user/favourites'),
  add: (trackId: string): Promise<ApiResponse<FavouriteTrack>> => api.post('/user/favourites', { trackId }),
  remove: (id: string): Promise<ApiResponse<FavouriteTrack>> => api.delete(`/user/favourites/${id}`),
};
