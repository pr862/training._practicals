import type { Track } from './track';

export type Playlist = {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  is_published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PlaylistDetail = Playlist & {
  tracks?: Track[];
};

