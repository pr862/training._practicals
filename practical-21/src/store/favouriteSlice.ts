import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favouriteService } from '../services/favouriteService';
import type { FavouriteTrack, ApiResponse } from '../types/api';

interface FavouriteState {
  favourites: FavouriteTrack[];
  loading: boolean;
  error: string | null;
}

const initialState: FavouriteState = {
  favourites: [],
  loading: false,
  error: null,
};

export const fetchFavourites = createAsyncThunk<
  FavouriteTrack[],
  void,
  { rejectValue: string }
>(
  'favourites/fetchFavourites',
  async () => {
    const response = await favouriteService.getAll() as ApiResponse<FavouriteTrack[]>;
    if (response.success) {
      return response.data || [];
    }
    throw new Error(response.message || 'Failed to fetch favourites');
  }
);

export const addFavourite = createAsyncThunk<
  FavouriteTrack,
  string,
  { rejectValue: string }
>(
  'favourites/addFavourite',
  async (trackId) => {
    const response = await favouriteService.add(trackId) as ApiResponse<FavouriteTrack>;
    if (response.success) {
      return response.data as FavouriteTrack;
    }
    throw new Error('Failed to add favourite');
  }
);

export const removeFavourite = createAsyncThunk(
  'favourites/removeFavourite',
  async (id: string) => {
    await favouriteService.remove(id);
    return id;
  }
);

const favouriteSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavourites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = action.payload;
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed';
      })
      .addCase(addFavourite.fulfilled, (state, action) => {
        state.favourites.push(action.payload);
      })
      .addCase(removeFavourite.fulfilled, (state, action) => {
state.favourites = state.favourites.filter(f => f.id !== Number(action.payload));
      });
  },
});

export default favouriteSlice.reducer;

