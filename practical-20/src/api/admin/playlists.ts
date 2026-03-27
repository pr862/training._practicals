import { api } from '../http';
import type { Playlist, PlaylistDetail } from '../../types/playlist';

export type PlaylistInput = {
  name: string;
  description: string;
  is_published: boolean;
  image: File | null;
};

const toFormData = (input: PlaylistInput): FormData => {
  const fd = new FormData();
  fd.set('name', input.name);
  if (input.description) fd.set('description', input.description);
  fd.set('is_published', input.is_published ? 'true' : 'false');
  if (input.image) fd.set('image', input.image);
  return fd;
};

export const adminPlaylistsApi = {
  list(): Promise<Playlist[]> {
    return api.json<Playlist[]>('/admin/playlists', { method: 'GET' });
  },
  get(id: number): Promise<PlaylistDetail> {
    return api.json<PlaylistDetail>(`/admin/playlists/${id}`, { method: 'GET' });
  },
  create(input: PlaylistInput): Promise<Playlist> {
    return api.form<Playlist>('/admin/playlists', toFormData(input), { method: 'POST' });
  },
  update(id: number, input: PlaylistInput): Promise<Playlist> {
    return api.form<Playlist>(`/admin/playlists/${id}`, toFormData(input), { method: 'PUT' });
  },
  remove(id: number): Promise<{ message: string }> {
    return api.json<{ message: string }>(`/admin/playlists/${id}`, { method: 'DELETE' });
  },
  addTrack(playlistId: number, trackId: number): Promise<{ message: string }> {
    return api.json<{ message: string }>(`/admin/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: { track_id: trackId },
    });
  },
  removeTrack(playlistId: number, trackId: number): Promise<{ message: string }> {
    return api.json<{ message: string }>(`/admin/playlists/${playlistId}/tracks`, {
      method: 'DELETE',
      body: { track_id: trackId },
    });
  },
};

