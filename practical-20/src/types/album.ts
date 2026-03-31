import type { Artist } from './artist';
import type { Track } from './track';

export type Album = {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  published_at: string | null;
  is_published: boolean;
  artist_id: number | null;
  artist: Artist;
  createdAt: string;
  updatedAt: string;
};

export type AlbumDetail = Album & {
  tracks?: Track[];
};

