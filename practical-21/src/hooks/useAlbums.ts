import { useState, useEffect } from 'react';
import { albumsAPI } from '../services/api';
import type { Album } from '../types/api';

export const useAlbums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const response = await albumsAPI.getAll();
        if (response.data.success) {
          setAlbums(response.data.data || []);
        } else {
          setError('Failed to fetch albums');
        }
      } catch (err) {
        setError('Failed to fetch albums');
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  return { albums, loading, error, refetch: () => {/* impl */} };
};
