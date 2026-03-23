import api from './api';
import type { ApiResponse, FavouriteTrack } from '../types/api';

export const favouriteService = {
  getAll: () => api.get<ApiResponse<FavouriteTrack[]>>('/user/favourites'),
  add: (trackId: string | number) =>
    api.post<ApiResponse<FavouriteTrack>>('/user/favourites', { trackId }),
  remove: (id: string | number) =>
    api.delete<ApiResponse<FavouriteTrack>>(`/user/favourites/${id}`),
};
