import { useState, useEffect, useCallback } from 'react';
import { artistService } from '../services/artist';
import { trackService } from '../services/track';
import { mapArtist, mapTrack } from '../utils/mappers';
import { unwrapApiList } from '../utils/apiResponse';
import type { Artist, Track } from '../types/api';

export const useArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchArtists = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await artistService.getAll();
      const { items, message, ok } = unwrapApiList<Artist>(response.data);
      if (ok) {
        setArtists(items.map(mapArtist));
      } else {
        setArtists([]);
        setError(message || 'Failed to fetch artists');
      }
    } catch {
      setError('Something went wrong while fetching artists');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  return { artists, loading, error, refetch: fetchArtists };
};

export const useArtistTracks = (artistId: string) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchTracks = useCallback(async () => {
    if (!artistId) {
      setLoading(false);
      setError('');
      setTracks([]);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await trackService.getByArtist(artistId);
      const { items, message, ok } = unwrapApiList<Track>(response.data);

      if (ok) {
        setTracks(items.map(mapTrack));
      } else {
        setTracks([]);
        setError(message || 'Failed to fetch tracks');
      }
    } catch {
      setError('Something went wrong while fetching tracks');
    } finally {
      setLoading(false);
    }
  }, [artistId]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  return { tracks, loading, error, refetch: fetchTracks };
};
