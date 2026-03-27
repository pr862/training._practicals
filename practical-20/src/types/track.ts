import type { Album } from './album';

export type Track = {
  id: number;
  name: string;
  index: number | null;
  album_id: number | null;
  is_published: boolean;
  track_url: string | null;
  image_url: string | null;
  album: Album;
  createdAt: string;
  updatedAt: string;
};

export type TrackDetail = Track;

