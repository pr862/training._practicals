import { useCallback, useEffect, useMemo, useState } from 'react';
import { favouriteService } from '../services/favouriteService';
import { useAuth } from './useAuth';
import type { FavouriteTrack } from '../types/api';
import { getImageUrl } from '../utils/imageHelper';
import type { Track } from '../types/api';

const mapTrack = (t: any): Track => {
  const title = t?.title || t?.name || t?.track_name || 'Unknown Title';
  return {
    id: t?.id,
    title,
    image: getImageUrl(t?.image || t?.image_url),
    audioUrl:
      t?.audioUrl ||
      t?.audio_url ||
      t?.audio ||
      t?.track_url ||
      t?.trackUrl ||
      t?.file_url ||
      t?.stream_url ||
      '',
    artistId: t?.artistId || t?.artist_id || t?.album?.artist?.id,
    artistName:
      t?.artistName ||
      t?.artist_name ||
      t?.artist?.name ||
      t?.album?.artist?.name ||
      'Unknown Artist',
    albumId: t?.albumId || t?.album_id || t?.album?.id,
    albumTitle:
      t?.album?.title ||
      t?.album_title ||
      t?.albumTitle ||
      t?.album?.name ||
      'Unknown Album',
    duration: t?.duration,
    plays: t?.plays,
  };
};

const mapFavourite = (fav: any): FavouriteTrack => {
  const track = fav?.track ? mapTrack(fav.track) : undefined;
  return {
    id: fav?.id,
    userId: fav?.userId || fav?.user_id || 0,
    trackId: fav?.trackId || fav?.track_id || track?.id,
    track: track as any,
    createdAt: fav?.createdAt || fav?.created_at || new Date().toISOString(),
  };
};

export const useFavourites = (options?: { enabled?: boolean }) => {
  const { user } = useAuth();
  const enabled = options?.enabled ?? true;
  const [favourites, setFavourites] = useState<FavouriteTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFavourites = useCallback(async () => {
    if (!enabled || !user?.id) {
      setLoading(false);
      setError('');
      setFavourites([]);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await favouriteService.getAll(user.id);
      if (response.data.success) {
        setFavourites((response.data.data || []).map(mapFavourite));
      } else {
        setError(response.data.message || 'Failed to fetch favourites');
      }
    } catch {
      setError('Failed to fetch favourites');
    } finally {
      setLoading(false);
    }
  }, [enabled, user?.id]);

  useEffect(() => {
    void fetchFavourites();
  }, [fetchFavourites]);

  const favouriteByTrackId = useMemo(() => {
    const map = new Map<number, FavouriteTrack>();
    for (const fav of favourites) {
      if (typeof fav?.trackId === 'number') map.set(fav.trackId, fav);
      else if (typeof fav?.track?.id === 'number') map.set(fav.track.id, fav);
    }
    return map;
  }, [favourites]);

  const toggleFavouriteByTrackId = useCallback(
    async (trackId: number) => {
      if (!enabled || !user?.id) return;

      const existing = favouriteByTrackId.get(trackId);
      try {
        if (existing) {
          const res = await favouriteService.removeByTrackId(trackId);
          if (res.data.success) {
            setFavourites((prev) => prev.filter((f) => f.trackId !== trackId));
          }
        } else {
          const res = await favouriteService.add(trackId);
          if (res.data.success) {
            const created = mapFavourite(res.data.data);
            setFavourites((prev) => [created, ...prev]);
          }
        }
      } catch {
      }
    },
    [enabled, user?.id, favouriteByTrackId]
  );

  return {
    favourites,
    loading,
    error,
    refetch: fetchFavourites,
    toggleFavouriteByTrackId,
    isFavouriteTrack: (trackId: number) => favouriteByTrackId.has(trackId),
  };
};
