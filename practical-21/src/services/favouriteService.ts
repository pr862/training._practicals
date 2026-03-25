import api from './api';
import type { ApiResponse, FavouriteTrack } from '../types/api';

export const favouriteService = {
  getAll: (userId: number) => api.get<ApiResponse<FavouriteTrack[]>>(`/users/favourites/${userId}`),
  add: (trackId:  number) =>
    api.post<ApiResponse<FavouriteTrack>>(`/users/favourites/${trackId}`),
  removeByTrackId: (trackId:number) =>
    api.delete<ApiResponse<FavouriteTrack>>(`/users/favourites/${trackId}`),
};
