export interface BackendUser {
  id: number;
  name: string;
  email?: string;
  role?: 'user' | 'admin';
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendArtist {
  id: number;
  name: string;
  image_url?: string;
  description?: string;
  total_tracks?: number;
  tracks?: BackendTrack[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendAlbum {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  published_at?: string;
  is_published?: boolean;
  artist_id: number;
  artist?: BackendArtist;
  tracks?: BackendTrack[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendTrack {
  id: number;
  name: string;
  track_url?: string;
  image_url?: string;
  album_id: number;
  album?: BackendAlbum;
  artist?: BackendArtist;
  is_published?: boolean;
  index?: number;
  duration?: number;
  plays?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendPlaylist {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  is_published?: boolean;
  user_id: number;
  tracks?: BackendTrack[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendFavouriteTrack {
  id: number;
  user_id: number;
  track_id: number;
  track?: BackendTrack;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
