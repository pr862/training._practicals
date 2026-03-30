import { useState, useEffect, useCallback } from 'react';
import { albumService } from '../services/album';
import { unwrapApiList } from '../utils/apiResponse';
import { mapAlbum } from '../utils/mappers';
import type { Album } from '../types/api';

const toArtistId = (value: unknown): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const albumArtistId = (album: any): number | null =>
  toArtistId(album?.artistId ?? album?.artist_id ?? album?.artist?.id);

export const useAlbums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAlbums = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await albumService.getAll();
      const { items, message, ok } = unwrapApiList<any>(response.data);

      if (ok) {
        setAlbums(items.map(mapAlbum));
      } else {
        setAlbums([]);
        setError(message || 'Failed to fetch albums');
      }
    } catch {
      setAlbums([]);
      setError('Something went wrong while fetching albums');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return {
    albums,
    loading,
    error,
    refetch: fetchAlbums,
  };
};

export const useArtistAlbums = (artistId: string) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchAlbums = useCallback(async () => {
    const parsedArtistId = toArtistId(artistId);

    if (parsedArtistId === null) {
      setLoading(false);
      setError('');
      setAlbums([]);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await albumService.getAll();
      const { items, message, ok } = unwrapApiList<any>(response.data);

      if (ok) {
        const artistAlbums = items.filter((album) => albumArtistId(album) === parsedArtistId);
        setAlbums(artistAlbums.map(mapAlbum));
      } else {
        setAlbums([]);
        setError(message || 'Failed to fetch albums');
      }
    } catch {
      setAlbums([]);
      setError('Something went wrong while fetching albums');
    } finally {
      setLoading(false);
    }
  }, [artistId]);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return { albums, loading, error, refetch: fetchAlbums };
};
