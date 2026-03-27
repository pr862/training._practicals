import { api } from '../api/http';
import { useCallback } from 'react';
import type { Album } from '../types/album';
import type { Artist } from '../types/artist';
import type { Track } from '../types/track';
import type { Playlist } from '../types/playlist';
import type { User} from '../types/user';

import type { AlbumInput, ArtistInput, PlaylistInput, TrackInput, UserCreateInput } from '../types/input';

export type Entity = {
  id: number;
  [key: string]: any;
};

export type EntityInput<T extends Entity> = Partial<Omit<T, 'id'>> & {
  [K in keyof T]?: T[K] | File | null;
};

export const useApiService = <T extends Entity, TInput extends EntityInput<T> = EntityInput<T>>(
  basePath: string,
  toFormData?: (input: TInput) => FormData
) => {
  const list = useCallback(async (): Promise<T[]> => {
    return api.json<T[]>(basePath, { method: 'GET' });
  }, [basePath]);

  const get = useCallback(async (id: number): Promise<T> => {
    return api.json<T>(`${basePath}/${id}`, { method: 'GET' });
  }, [basePath]);

  const create = useCallback(async (input: TInput): Promise<T> => {
    if (toFormData) {
      return api.form<T>(basePath, toFormData(input), { method: 'POST' });
    }
    return api.json<T>(basePath, { 
      method: 'POST', 
      body: JSON.stringify(input),
      headers: { 'Content-Type': 'application/json' }
    });
  }, [basePath, toFormData]);

  const update = useCallback(async (id: number, input: TInput): Promise<T> => {
    if (toFormData) {
      return api.form<T>(`${basePath}/${id}`, toFormData(input), { method: 'PUT' });
    }
    return api.json<T>(`${basePath}/${id}`, { 
      method: 'PUT', 
      body: JSON.stringify(input),
      headers: { 'Content-Type': 'application/json' }
    });
  }, [basePath, toFormData]);

  const remove = useCallback(async (id: number): Promise<{ message: string }> => {
    return api.json<{ message: string }>(`${basePath}/${id}`, { method: 'DELETE' });
  }, [basePath]);

  return {
    list,
    get,
    create,
    update,
    remove
  };
};

export const useAlbumsApi = () => useApiService<Album, AlbumInput>('/admin/albums', toAlbumFormData);
export const useArtistsApi = () => useApiService<Artist, ArtistInput>('/admin/artists', toArtistFormData);
export const usePlaylistsApi = () => useApiService<Playlist, PlaylistInput>('/admin/playlists', toPlaylistFormData);
export const useTracksApi = () => useApiService<Track, TrackInput>('/admin/tracks', toTrackFormData);
export const useUsersApi = () => useApiService<User, UserCreateInput>('/admin/users');

const toAlbumFormData = (input: AlbumInput): FormData => {
  const fd = new FormData();
  fd.set('name', input.name);
  fd.set('artist_id', String(input.artist_id));
  if (input.description) fd.set('description', input.description);
  if (input.published_at) fd.set('published_at', input.published_at);
  if (input.is_published) fd.set('is_published', 'true');
  if (input.image) fd.set('image', input.image);
  return fd;
};

const toArtistFormData = (input: ArtistInput): FormData => {
  const fd = new FormData();
  fd.set('name', input.name);
  if (input.image) fd.set('image', input.image);
  return fd;
};

const toPlaylistFormData = (input: PlaylistInput): FormData => {
  const fd = new FormData();
  fd.set('name', input.name);
  if (input.description) fd.set('description', input.description);
  if (input.is_published) fd.set('is_published', 'true');
  if (input.image) fd.set('image', input.image);
  return fd;
};

const toTrackFormData = (input: TrackInput): FormData => {
  const fd = new FormData();
  fd.set('name', input.name);
  fd.set('album_id', String(input.album_id));
  if (input.index != null) fd.set('index', String(input.index));
  if (input.is_published) fd.set('is_published', 'true');
  if (input.trackFile) fd.set('track', input.trackFile);
  if (input.image) fd.set('image', input.image);
  return fd;
};