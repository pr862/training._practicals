import { useState, useEffect } from 'react';
import { artistsAPI } from '../services/api';
import type { Artist } from '../types/api';

export const useArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const response = await artistsAPI.getAll();
        if (response.data.success) {
          setArtists(response.data.data || []);
        } else {
          setError('Failed to fetch artists');
        }
      } catch (err) {
        setError('Failed to fetch artists');
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, []);

  return { artists, loading, error, refetch: () => {/* impl */} };
};
