import { useState, useEffect, useCallback } from 'react';
import { trackService } from '../services/track';
import { mapTrack } from '../utils/mappers';
import { unwrapApiList } from '../utils/apiResponse';
import type { Track } from '../types/api';

export const useTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTracks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await trackService.getAll();
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
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  return {
    tracks,
    loading,
    error,
    refetch: fetchTracks
  };
};
