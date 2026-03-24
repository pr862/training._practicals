import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Track } from '../types/api';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  playlist: Track[];
  currentIndex: number;
  isShuffle: boolean;
  isRepeat: boolean;
}

type SetQueuePayload = {
  tracks: Track[];
  startIndex?: number;
  startTrackId?: number;
};

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  volume: 50,
  playlist: [],
  currentIndex: 0,
  isShuffle: false,
  isRepeat: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload;
    },
    play: (state) => {
      state.isPlaying = true;
    },
    pause: (state) => {
      state.isPlaying = false;
    },
    setProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    setPlaylist: (state, action: PayloadAction<Track[]>) => {
      state.playlist = action.payload;
      if (action.payload.length === 0) {
        state.currentIndex = 0;
      }
    },
    setQueue: (state, action: PayloadAction<SetQueuePayload>) => {
      const { tracks, startIndex, startTrackId } = action.payload;
      state.playlist = tracks;
      state.progress = 0;

      if (tracks.length === 0) {
        state.currentTrack = null;
        state.currentIndex = 0;
        return;
      }

      let nextIndex = 0;
      if (typeof startIndex === 'number' && startIndex >= 0 && startIndex < tracks.length) {
        nextIndex = startIndex;
      } else if (typeof startTrackId === 'number') {
        const foundIndex = tracks.findIndex((t) => t.id === startTrackId);
        if (foundIndex >= 0) nextIndex = foundIndex;
      }

      state.currentIndex = nextIndex;
      state.currentTrack = tracks[nextIndex] ?? null;
    },
    nextTrack: (state) => {
      const { playlist } = state;
      if (playlist.length === 0) return;

      let nextIndex = state.currentIndex;
      if (state.isShuffle && playlist.length > 1) {
        do {
          nextIndex = Math.floor(Math.random() * playlist.length);
        } while (nextIndex === state.currentIndex);
      } else {
        nextIndex = (state.currentIndex + 1) % playlist.length;
      }

      state.currentIndex = nextIndex;
      state.currentTrack = playlist[nextIndex] ?? null;
      state.progress = 0;
    },
    previousTrack: (state) => {
      const { playlist } = state;
      if (playlist.length === 0) return;

      let nextIndex = state.currentIndex;
      if (state.isShuffle && playlist.length > 1) {
        do {
          nextIndex = Math.floor(Math.random() * playlist.length);
        } while (nextIndex === state.currentIndex);
      } else {
        nextIndex = (state.currentIndex - 1 + playlist.length) % playlist.length;
      }

      state.currentIndex = nextIndex;
      state.currentTrack = playlist[nextIndex] ?? null;
      state.progress = 0;
    },
    playTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload;
      state.isPlaying = true;
      state.progress = 0;
      const indexInPlaylist = state.playlist.findIndex((t) => t.id === action.payload.id);
      if (indexInPlaylist >= 0) {
        state.currentIndex = indexInPlaylist;
      }
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setShuffle: (state, action: PayloadAction<boolean>) => {
      state.isShuffle = action.payload;
    },
    toggleShuffle: (state) => {
      state.isShuffle = !state.isShuffle;
    },
    setRepeat: (state, action: PayloadAction<boolean>) => {
      state.isRepeat = action.payload;
    },
    toggleRepeat: (state) => {
      state.isRepeat = !state.isRepeat;
    },
  },
});

export const { 
  setCurrentTrack,
  play,
  pause,
  setProgress,
  setPlaylist,
  setQueue,
  nextTrack,
  previousTrack,
  playTrack,
  setVolume,
  setShuffle,
  toggleShuffle,
  setRepeat,
  toggleRepeat,
} = playerSlice.actions;
export default playerSlice.reducer;
