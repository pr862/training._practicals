import { useState, useEffect, useCallback } from 'react';
import { artistsAPI } from '../services/api';
import { trackService } from '../services/trackService';
import { getImageUrl } from '../utils/imageHelper';
import type { Artist, Track } from '../types/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const useArtists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchArtists = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await artistsAPI                                                                                     .getAll();
      const apiData = response.data;
      if (apiData?.success && Array.isArray(apiData.data)) {
        const mappedArtists = apiData.data.map((a: any) => ({
          ...a,
          image: getImageUrl(a.image || a.image_url)
        }));
        setArtists(mappedArtists);
      } else if (Array.isArray(apiData)) {
        const mappedArtists = apiData.map((a: any) => ({
          ...a,
          image: getImageUrl(a.image || a.image_url)
        }));
        setArtists(mappedArtists);
      } else {
        setError(apiData?.message || 'Failed to fetch artists');
      }
    } catch (err) {
      setError('Something went wrong while fetching artists');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  return { artists, loading, error, refetch: fetchArtists };
};

export const useArtistTracks = (artistId: string) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchTracks = useCallback(async () => {
    if (!artistId) return;

    try {
      setLoading(true);
      setError('');

      const response = await trackService.getByArtist(artistId) as {
        data: ApiResponse<Track[]>;
      };

      if (response.data.success && Array.isArray(response.data.data)) {
        const mappedTracks = response.data.data.map((track: any) => {
          
          return {
            id: track.id || track.track_id || track._id,
            title: track.title || track.name || track.track_title || track.song_name || 'Unknown Track',
            image: getImageUrl(track.image || track.image_url || track.cover || track.thumbnail),
            audioUrl:
              track.audio_url ||
              track.audio ||
              track.track_url ||
              track.trackUrl ||
              track.file_url ||
              track.stream_url,
            artistId: track.artist_id || track.artistId || (track.artist && track.artist.id) || track.artist,
            artistName: track.artist_name || track.artistName || (track.artist && track.artist.name) || track.artist || track.singer || 'Unknown Artist',
            albumId: track.album_id || track.albumId || (track.album && track.album.id) || track.album,
            albumTitle: track.album_title || track.albumTitle || (track.album && track.album.name) || (track.album && track.album.title) || track.album,
            duration: track.duration || track.length || track.runtime,
            plays: track.plays || track.play_count || track.playCount || 0
          };
        });
        setTracks(mappedTracks);
      } else {
        setError(response.data.message || 'Failed to fetch tracks');
      }
    } catch (err) {
      setError('Something went wrong while fetching tracks');
    } finally {
      setLoading(false);
    }
  }, [artistId]);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  return { tracks, loading, error, refetch: fetchTracks };
};
