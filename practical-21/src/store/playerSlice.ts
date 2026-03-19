import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Track } from '../types/api';

interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number; // 0-100
  volume: number; // 0-100
  playlist: Track[];
  currentIndex: number;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  progress: 0,
  volume: 50,
  playlist: [],
  currentIndex: 0,
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
      if (action.payload.length > 0) {
        state.currentTrack = action.payload[0];
        state.currentIndex = 0;
      }
    },
    nextTrack: (state) => {
      if (state.playlist.length > 0 && state.currentIndex < state.playlist.length - 1) {
        state.currentIndex += 1;
        state.currentTrack = state.playlist[state.currentIndex];
      }
    },
    previousTrack: (state) => {
      if (state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.currentTrack = state.playlist[state.currentIndex];
      }
    },
    playTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload;
      state.isPlaying = true;
    },
  },
});

export const { 
  setCurrentTrack, play, pause, setProgress, setPlaylist, nextTrack, previousTrack, playTrack 
} = playerSlice.actions;
export default playerSlice.reducer;
