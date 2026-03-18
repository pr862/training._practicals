import { useState, useEffect } from 'react';
import { tracksAPI } from '../services/api';
import type { Track } from '../types/api';

export const useTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const response = await tracksAPI.getAll();
        if (response.data.success) {
          setTracks(response.data.data || []);
        } else {
          setError('Failed to fetch tracks');
        }
      } catch (err) {
        setError('Failed to fetch tracks');
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  return { tracks, loading, error, refetch: () => {/* impl refetch */} };
};
