import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { trackService } from '../services/trackService';
import type { Track } from '../types/api';

interface TrackState {
  tracks: Track[];
  loading: boolean;
  error: string | null;
}

const initialState: TrackState = {
  tracks: [],
  loading: false,
  error: null,
};

export const fetchTracks = createAsyncThunk<
  Track[],
  void,
  { rejectValue: string }
>(
  'tracks/fetchTracks',
  async () => {
    const response = await trackService.getAll() as any;
    if (response.data.success) {
      return response.data.data || [];
    }
    throw new Error(response.data.message || 'Failed to fetch tracks');
  }
);

const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    clearTracks: (state) => {
      state.tracks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.loading = false;
        state.tracks = action.payload;
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch';
      });
  },
});

export const { clearTracks } = trackSlice.actions;
export default trackSlice.reducer;

