import { api } from '../http';
import type { Artist } from '../../types/artist';

export type ArtistInput = { name: string; image?: File | null };

export const adminArtistsApi = {
  list(): Promise<Artist[]> {
    return api.json<Artist[]>('/admin/artists', { method: 'GET' });
  },
  get(id: number): Promise<Artist> {
    return api.json<Artist>(`/admin/artists/${id}`, { method: 'GET' });
  },
  async create(input: ArtistInput): Promise<Artist> {
    const fd = new FormData();
    fd.set('name', input.name);
    if (input.image) fd.set('image', input.image);
    return api.form<Artist>('/admin/artists', fd, { method: 'POST' });
  },
  async update(id: number, input: ArtistInput): Promise<Artist> {
    const fd = new FormData();
    fd.set('name', input.name);
    if (input.image) fd.set('image', input.image);
    return api.form<Artist>(`/admin/artists/${id}`, fd, { method: 'PUT' });
  },
  remove(id: number): Promise<{ message: string }> {
    return api.json<{ message: string }>(`/admin/artists/${id}`, { method: 'DELETE' });
  },
};

