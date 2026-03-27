export type AlbumInput = {
  name: string;
  description: string;
  published_at: string;
  is_published: boolean;
  artist_id: number;
  image: File | null;
};

export type ArtistInput = {
  name: string;
  image: File | null;
};

export type PlaylistInput = {
  name: string;
  description: string;
  is_published: boolean;
  image: File | null;
};

export type TrackInput = {
  name: string;
  album_id: number;
  index: number | null;
  is_published: boolean;
  trackFile: File | null;
  image: File | null;
};

export type UserInput = {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
};

export type UserCreateInput = {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
};