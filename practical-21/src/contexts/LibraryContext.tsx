import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useFavourites } from '../hooks/useFavourites';
import { usePlaylists } from '../hooks/usePlaylists';
import { playlistService } from '../services/playlistService';

type LibraryContextValue = {
  favouritesLoading: boolean;
  isFavouriteTrack: (trackId: number) => boolean;
  toggleFavouriteByTrackId: (trackId: number) => Promise<void>;
  playlistsLoading: boolean;
  playlistsError?: string;
  playlists: { id: number; title: string }[];
  addTrackToPlaylist: (playlistId: number, trackId: number) => Promise<void>;
  refetchPlaylists: () => Promise<void>;
};

const LibraryContext = createContext<LibraryContextValue | null>(null);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const {
    loading: favouritesLoading,
    isFavouriteTrack,
    toggleFavouriteByTrackId,
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
    async (playlistId: number, trackId: number) => {
      if (!isAuthenticated) return;
      const res = await playlistService.addTrack(String(playlistId), String(trackId));
      if (!res.success) throw new Error(res.message || 'Failed to add track to playlist');
      await refetchPlaylists();
    },
    [isAuthenticated, refetchPlaylists]
  );

  const value = useMemo<LibraryContextValue>(
    () => ({
      favouritesLoading,
      isFavouriteTrack,
      toggleFavouriteByTrackId,
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

