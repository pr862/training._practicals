import { useCallback, useEffect, useState } from 'react';
import { playlistsAPI } from '../services/api';
import { getImageUrl } from '../utils/imageHelper';
import type { Playlist } from '../types/api';

const mapPlaylist = (p: any): Playlist => {
  const tracks = Array.isArray(p?.tracks) ? p.tracks : [];
  const mappedTracks = tracks.map((t: any) => ({
    id: t?.id,
    title: t?.title || t?.name || 'Unknown Title',
    image: getImageUrl(t?.image || t?.image_url),
    audioUrl: t?.audioUrl || t?.audio_url || t?.track_url || t?.trackUrl || '',
    artistId: t?.artistId || t?.artist_id,
    artistName: t?.artistName || t?.artist_name || t?.album?.artist?.name || 'Unknown Artist',
    albumId: t?.albumId || t?.album_id,
    albumTitle: t?.albumTitle || t?.album?.title || 'Unknown Album',
    duration: t?.duration,
    plays: t?.plays,
  }));

  return {
    id: p?.id,
    title: p?.title || p?.name || 'Untitled Playlist',
    userId: p?.userId || p?.user_id || 0,
    image: getImageUrl(p?.image || p?.image_url),
    tracks: mappedTracks,
    createdAt: p?.createdAt || p?.created_at,
    updatedAt: p?.updatedAt || p?.updated_at,
  };
};

export const usePlaylists = (options?: { enabled?: boolean }) => {
  const enabled = options?.enabled ?? true;
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPlaylists = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      setError('');
      setPlaylists([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await playlistsAPI.getAll();
      const apiData: any = response.data;

      if (apiData?.success && Array.isArray(apiData.data)) {
        setPlaylists(apiData.data.map(mapPlaylist));
      } else if (Array.isArray(apiData)) {
        setPlaylists(apiData.map(mapPlaylist));
      } else {
        setError(apiData?.message || 'Failed to fetch playlists');
      }
    } catch {
      setError('Failed to fetch playlists');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void fetchPlaylists();
  }, [fetchPlaylists]);

  return { playlists, loading, error, refetch: fetchPlaylists };
};
