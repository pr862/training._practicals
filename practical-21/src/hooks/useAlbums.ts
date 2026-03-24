import { useState, useEffect, useCallback } from 'react';
import { albumsAPI } from '../services/api';
import { getImageUrl } from '../utils/imageHelper';
import type { Album } from '../types/api';

export const useAlbums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAlbums = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await albumsAPI.getAll();

      const apiData = response.data;

      if (apiData?.success && Array.isArray(apiData.data)) {
        const mappedAlbums = apiData.data.map((a: any) => {

          return {
            id: a.id,
            title: a.title || a.name || 'Unknown Album',
            image: getImageUrl((a.image || a.image_url)?.replace('/images/', '/') || undefined),
            year:
              a.year ||
              (a.published_at
                ? new Date(a.published_at).getFullYear()
                : undefined),

            artistId: a.artistId || a.artist_id,

            artistName:
              a.artist?.name ||       
              a.artist_name ||        
              a.artistName ||         
              'Unknown Artist',    

            tracks: a.tracks || [],
          };
        });

        setAlbums(mappedAlbums);
      }

      else if (Array.isArray(apiData)) {
        const mappedAlbums = apiData.map((a: any) => {

          return {
            id: a.id,
            title: a.title || a.name || 'Unknown Album',
            image: getImageUrl((a.image || a.image_url)?.replace('/images/', '/') || undefined),

            year:
              a.year ||
              (a.published_at
                ? new Date(a.published_at).getFullYear()
                : undefined),

            artistId: a.artistId || a.artist_id,

            artistName:
              a.artist?.name ||
              a.artist_name ||
              a.artistName ||
              'Unknown Artist',

            tracks: a.tracks || [],
          };
        });

        setAlbums(mappedAlbums);
      }

      else {
        setError(apiData?.message || 'Failed to fetch albums');
      }

    } catch {
      setError('Failed to fetch albums');
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
