export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Artist {
  id: number;
  name: string;
  image_url?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Album {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  published_at?: Date;
  is_published?: boolean;
  artist_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Track {
  id: number;
  name: string;
  index?: number;
  track_url?: string;
  image_url?: string;
  album_id: number;
  is_published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  is_published?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FavouriteTracks {
  id: number;
  track_id: number;
  user_id: number;
  index?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthRequest extends Express.Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

