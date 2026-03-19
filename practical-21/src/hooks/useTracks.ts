import { useState, useEffect, useCallback } from 'react';
import { tracksAPI } from '../services/api';
import { getImageUrl } from '../utils/imageHelper';
import type { Track } from '../types/api';

export const useTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTracks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await tracksAPI.getAll();
      const apiData = response.data;

      if (apiData?.success && Array.isArray(apiData.data)) {
        const mappedTracks = apiData.data.map((t: any, index: number) => {
          return {
            id: t.id,
            title:
              t.title ||
              t.name ||
              t.track_name ||
              'Unknown Title',

            artistName:
              t.artist?.name ||
              t.artist_name ||
              t.artistName ||
              t["artist.name"] ||
              'Unknown Artist',

            image: getImageUrl(t.image || t.image_url),

            audioUrl: t.audioUrl || t.audio_url || '',

            artistId: t.artistId || t.artist_id,

            albumId: t.albumId || t.album_id,
            albumTitle:
              t.album?.title ||
              t.album_title ||
              t.albumTitle,

            duration: t.duration,
            plays: t.plays,
          };
        });
        setTracks(mappedTracks);

      }
      else if (Array.isArray(apiData)) {
        console.log("USING DIRECT ARRAY");
        const mappedTracks = apiData.map((t: any, index: number) => {
          console.log(`TRACK [${index}]:`, t);
          return {
            id: t.id,

            title:t.name ||'Unknown Title',

            artistName:
              t.artist?.name ||
              t.artist_name ||
              t.artistName || 'Unknown Artist',

            image: getImageUrl(t.image || t.image_url),

            audioUrl: t.audioUrl || t.audio_url || '',

            artistId: t.artistId || t.artist_id,

            albumId: t.albumId || t.album_id,


            duration: t.duration,
            plays: t.plays,
          };
        });

        setTracks(mappedTracks);

      } else {
        setError(apiData?.message || 'Failed to fetch tracks');
      }

    } catch (err) {
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