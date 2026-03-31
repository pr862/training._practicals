import { api } from '../http';
import type { Album, AlbumDetail } from '../../types/album';

export type AlbumInput = {
  name: string;
  description: string;
  published_at: string;
  is_published: boolean;
  artist_id: number;
  image?: File | null;
};

const toFormData = (input: AlbumInput): FormData => {
  const fd = new FormData();
  fd.set('name', input.name);
  fd.set('artist_id', String(input.artist_id));
  if (input.description) fd.set('description', input.description);
  if (input.published_at) fd.set('published_at', input.published_at);
  if (input.is_published) fd.set('is_published', 'true');
  if (input.image) fd.set('image', input.image);
  return fd;
};

export const adminAlbumsApi = {
  list(): Promise<Album[]> {
    return api.json<Album[]>('/admin/albums', { method: 'GET' });
  },
  get(id: number): Promise<AlbumDetail> {
    return api.json<AlbumDetail>(`/admin/albums/${id}`, { method: 'GET' });
  },
  create(input: AlbumInput): Promise<Album> {
    return api.form<Album>('/admin/albums', toFormData(input), { method: 'POST' });
  },
  update(id: number, input: AlbumInput): Promise<Album> {
    return api.form<Album>(`/admin/albums/${id}`, toFormData(input), { method: 'PUT' });
  },
  remove(id: number): Promise<{ message: string }> {
    return api.json<{ message: string }>(`/admin/albums/${id}`, { method: 'DELETE' });
  },
  addTrack(albumId: number, trackId: number): Promise<{ message: string }> {
    return api.json<{ message: string }>(`/admin/albums/${albumId}/tracks/${trackId}`, {
      method: 'POST',
    });
  },
  removeTrack(albumId: number, trackId: number): Promise<{ message: string }> {
    return api.json<{ message: string }>(`/admin/albums/${albumId}/tracks/${trackId}`, {
      method: 'DELETE',
    });
  },
};

