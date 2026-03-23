export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Track {
  id: number;
  title: string;
  image: string;
  audioUrl: string;

  artistId?: number;
  albumId?: number;
  albumTitle?: string;

  duration?: number;
  plays?: number;
}

export interface Artist {
  id: number;
  name: string;
  image: string;
  description?: string;
  totalTracks?: number;
  tracks?: Track[];  
}

export interface Album {
  id: number;
  title: string;
  artistId: number;
  artistName: string;
  image: string;
  year?: number;

  tracks?: Track[];     
}

export interface Playlist {
  id: number;
  title: string;

  userId: number;

  image: string;
  tracks: Track[];

  createdAt?: string;
  updatedAt?: string;
}

export interface FavouriteTrack {
  id: number;

  userId: number;
  trackId: number;

  track: Track;

  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}