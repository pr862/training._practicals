import { useCallback, useEffect, useState } from 'react';
import { playlistService } from '../services/playlist';
import { mapPlaylist } from '../utils/mappers';
import { unwrapApiList } from '../utils/apiResponse';
import type { Playlist } from '../types/api';

export const usePlaylists = (options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true;
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPlaylists = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      setError('');
      setPlaylists([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await playlistService.getAll();
      const { items, message, ok } = unwrapApiList<Playlist>(response);
      if (ok) {
        setPlaylists(items.map(mapPlaylist));
      } else {
        setPlaylists([]);
        setError(message || 'Failed to fetch playlists');
      }
    } catch {
      setError('Failed to fetch playlists');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void fetchPlaylists();
  }, [fetchPlaylists]);

  return { playlists, loading, error, refetch: fetchPlaylists };
};
