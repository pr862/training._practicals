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
        const mappedTracks = apiData.data.map((t: any) => {
          return {
            id: t.id,
            title:
              t.title ||
              t.name ||
              t.track_name ||
              'Unknown Title',


            image: getImageUrl(t.image || t.image_url),

            audioUrl:
              t.audioUrl ||
              t.audio_url ||
              t.audio ||
              t.track_url ||
              t.trackUrl ||
              t.file_url ||
              t.stream_url ||
              '',

            artistId: t.artistId || t.artist_id,
            artistName:
              t.artistName ||
              t.artist_name ||
              t.artist?.name ||
              t.album?.artist?.name ||
              t.artist?.title ||
              'Unknown Artist',

            albumId: t.albumId || t.album_id,
            albumTitle:
              t.album?.title ||
              t.album_title ||
              t.albumTitle ||
              t.album?.name ||
              'Unknown Album',

            duration: t.duration,
            plays: t.plays,
          };
        });
        setTracks(mappedTracks);

      }
      else if (Array.isArray(apiData)) {
        const mappedTracks = apiData.map((t: any) => {
          return {
            id: t.id,
            title: t.name || 'Unknown Title',
            image: getImageUrl(t.image || t.image_url),
            audioUrl:
              t.audioUrl ||
              t.audio_url ||
              t.audio ||
              t.track_url ||
              t.trackUrl ||
              t.file_url ||
              t.stream_url ||
              '',

            artistId: t.artistId || t.artist_id,
            artistName:
              t.artistName ||
              t.artist_name ||
              t.artist?.name ||
              t.album?.artist?.name ||
              t.artist?.title ||
              'Unknown Artist',

            albumId: t.albumId || t.album_id,
            albumTitle:
              t.album?.title ||
              t.album_title ||
              t.albumTitle ||
              t.album?.name ||
              'Unknown Album',


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
