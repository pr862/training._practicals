import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useFavourites } from '../hooks/useFavourites';
import { usePlaylists } from '../hooks/usePlaylists';
import { playlistService } from '../services/playlist';
import { emitToast } from '../utils/toast';

type LibraryContextValue = {
  favouritesLoading: boolean;
  isFavouriteTrack: (trackId: number) => boolean;
  toggleFavouriteByTrackId: (trackId: number, trackTitle?: string) => Promise<void>;
  isRemoveLoading: (trackId: number) => boolean;
  playlistsLoading: boolean;
  playlistsError?: string;
  playlists: { id: number; title: string }[];
  addTrackToPlaylist: (playlistId: number, trackId: number, playlistTitle?: string, trackTitle?: string) => Promise<void>;
  refetchPlaylists: () => Promise<void>;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const {
    loading: favouritesLoading,
    isFavouriteTrack,
    toggleFavouriteByTrackId,
    isRemoveLoading,
  } = useFavourites({ enabled: isAuthenticated });

  const {
    playlists,
    loading: playlistsLoading,
    error: playlistsError,
    refetch: refetchPlaylists,
  } = usePlaylists({ enabled: isAuthenticated });

  const slimPlaylists = useMemo(
    () => playlists.map((p) => ({ id: p.id, title: p.title })),
    [playlists]
  );

  const addTrackToPlaylist = useCallback(
    async (playlistId: number, trackId: number, playlistTitle?: string, trackTitle?: string) => {
      if (!isAuthenticated) return;
      const res = await playlistService.addTrack(String(playlistId), String(trackId));
      await refetchPlaylists();
      emitToast({
        type: 'success',
        message: trackTitle
          ? `Added "${trackTitle}" to ${playlistTitle || 'playlist'}`
          : res.message || `Track added to ${playlistTitle || 'playlist'}`,
      });
    },
    [isAuthenticated, refetchPlaylists]
  );

  const value = useMemo<LibraryContextValue>(
    () => ({
      favouritesLoading,
      isFavouriteTrack,
      toggleFavouriteByTrackId,
      isRemoveLoading,
      playlistsLoading,
      playlistsError: playlistsError || undefined,
      playlists: slimPlaylists,
      addTrackToPlaylist,
      refetchPlaylists,
    }),
    [
      favouritesLoading,
      isFavouriteTrack,
      toggleFavouriteByTrackId,
      isRemoveLoading,
      playlistsLoading,
      playlistsError,
      slimPlaylists,
      addTrackToPlaylist,
      refetchPlaylists,
    ]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider');
  return ctx;
};
