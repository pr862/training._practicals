import api from './api';
import type { ApiResponse, FavouriteTrack } from '../types/api';

export const favouriteService = {
  getAll: (userId: number) => api.get<ApiResponse<FavouriteTrack[]>>(`/user/favourites/${userId}`),
  add: (trackId:  number) =>
    api.post<ApiResponse<FavouriteTrack>>(`/user/favourites/${trackId}`),
  removeByTrackId: (trackId:number) =>
    api.delete<ApiResponse<FavouriteTrack>>(`/user/favourites/${trackId}`),
};
