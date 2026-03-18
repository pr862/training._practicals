import api from './api';
import type { ApiResponse, FavouriteTrack } from '../types/api';

export const favouriteService = {
  getAll: (): Promise<ApiResponse<FavouriteTrack[]>> => api.get('/favourites'),
  add: (trackId: string): Promise<ApiResponse<FavouriteTrack>> => api.post('/favourites', { trackId }),
  remove: (id: string): Promise<ApiResponse<void>> => api.delete(`/favourites/${id}`),
};
