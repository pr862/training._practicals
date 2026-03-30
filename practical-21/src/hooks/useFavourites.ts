import { useCallback, useEffect, useMemo, useState } from 'react';
import { favouriteService } from '../services/favourite';
import { useAuth } from './useAuth';
import type { FavouriteTrack } from '../types/api';
import { mapFavourite } from '../utils/mappers';
import { emitToast } from '../utils/toast';

export const useFavourites = (options?: { enabled?: boolean }) => {
  const { user } = useAuth();
  const enabled = options?.enabled ?? true;
  const [favourites, setFavourites] = useState<FavouriteTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removeLoading, setRemoveLoading] = useState<Record<number, boolean>>({});

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
    async (trackId: number, trackTitle?: string) => {
      if (!enabled || !user?.id) return;

      const existing = favouriteByTrackId.get(trackId);
      try {
        if (existing) {
          setFavourites((prev) => prev.filter((f) => f.trackId !== trackId));
          setRemoveLoading((prev) => ({ ...prev, [trackId]: true }));

          const res = await favouriteService.removeByTrackId(trackId);
          if (!res.data.success) {
            setFavourites((prev) => [...prev, existing]);
            emitToast({
              type: 'error',
              message: res.data.message || 'Failed to remove track from favourites',
            });
            return;
          }
          emitToast({
            type: 'success',
            message: trackTitle ? `Removed "${trackTitle}" from favourites` : 'Removed track from favourites',
          });
        } else {
          const res = await favouriteService.add(trackId);
          if (res.data.success) {
            const created = mapFavourite(res.data.data);
            setFavourites((prev) => [created, ...prev]);
            emitToast({
              type: 'success',
              message: trackTitle ? `Added "${trackTitle}" to favourites` : 'Added track to favourites',
            });
          } else {
            emitToast({
              type: 'error',
              message: res.data.message || 'Failed to add track to favourites',
            });
          }
        }
      } catch {
        if (existing) {
          setFavourites((prev) => [...prev, existing]);
        }
        emitToast({
          type: 'error',
          message: existing
            ? trackTitle
              ? `Failed to remove "${trackTitle}" from favourites`
              : 'Failed to remove track from favourites'
            : trackTitle
              ? `Failed to add "${trackTitle}" to favourites`
              : 'Failed to add track to favourites',
        });
      } finally {
        setRemoveLoading((prev) => ({ ...prev, [trackId]: false }));
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
    isRemoveLoading: (trackId: number) => removeLoading[trackId] || false,
  };
};
