import { api } from '../http';
import type { Track, TrackDetail } from '../../types/track';

export type TrackInput = {
  name: string;
  index: number;
  album_id: number;
  is_published: boolean;
  trackFile: File | null;
  image: File | null;
};

const toFormData = (input: TrackInput): FormData => {
  const fd = new FormData();
  fd.set('name', input.name);
  fd.set('album_id', String(input.album_id));
  if (input.index !== undefined && input.index !== null) fd.set('index', String(input.index));
  fd.set('is_published', input.is_published ? 'true' : 'false');
  if (input.trackFile) fd.set('track', input.trackFile);
  if (input.image) fd.set('image', input.image);
  return fd;
};

export const adminTracksApi = {
  list(): Promise<Track[]> {
    return api.json<Track[]>('/admin/tracks', { method: 'GET' });
  },
  get(id: number): Promise<TrackDetail> {
    return api.json<TrackDetail>(`/admin/tracks/${id}`, { method: 'GET' });
  },
  create(input: TrackInput): Promise<Track> {
    return api.form<Track>('/admin/tracks', toFormData(input), { method: 'POST' });
  },
  update(id: number, input: TrackInput): Promise<Track> {
    return api.form<Track>(`/admin/tracks/${id}`, toFormData(input), { method: 'PUT' });
  },
  remove(id: number): Promise<{ message: string }> {
    return api.json<{ message: string }>(`/admin/tracks/${id}`, { method: 'DELETE' });
  },
};

