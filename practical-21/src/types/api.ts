export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Track {
  id: string;
  title: string;
  artist: Artist;
  album?: Album;
  duration: number;
  image: string;
  audioUrl: string;
  plays: number;
}

export interface Artist {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: Artist;
  image: string;
  year: number;
  tracks: Track[];
}

export interface Playlist {
  id: string;
  title: string;
  userId: string;
  image: string;
  tracks: Track[];
}

export interface FavouriteTrack {
  id: string;
  userId: string;
  trackId: string;
  track: Track;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
