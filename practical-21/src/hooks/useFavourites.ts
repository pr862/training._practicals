import { useState, useEffect } from 'react';
import { favouritesAPI } from '../services/api';
import type { FavouriteTrack } from '../types/api';

export const useFavourites = () => {
  const [favourites, setFavourites] = useState<FavouriteTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        setLoading(true);
        const response = await favouritesAPI.getAll();
        if (response.data.success) {
          setFavourites(response.data.data || []);
        } else {
          setError('Failed to fetch favourites');
        }
      } catch (err) {
        setError('Failed to fetch favourites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const addFavourite = async (trackId: string) => {
    try {
      const response = await favouritesAPI.add(trackId);
      if (response.data.success) {
        // refetch or optimistic update
      }
    } catch (err) {
      console.error('Add favourite failed');
    }
  };

  return { favourites, loading, error, addFavourite, refetch: () => {/* impl */} };
};
