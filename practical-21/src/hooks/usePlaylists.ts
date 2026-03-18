import { useState, useEffect } from 'react';
import { playlistsAPI } from '../services/api';
import type { Playlist } from '../types/api';

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await playlistsAPI.getAll();
        if (response.data.success) {
          setPlaylists(response.data.data || []);
        } else {
          setError('Failed to fetch playlists');
        }
      } catch (err) {
        setError('Failed to fetch playlists');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  return { playlists, loading, error, refetch: () => {/* impl */} };
};
