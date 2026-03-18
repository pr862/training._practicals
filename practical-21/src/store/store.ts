import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import playerReducer from './playerSlice';
import trackReducer from './trackSlice';
import favouriteReducer from './favouriteSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    player: playerReducer,
    tracks: trackReducer,
    favourites: favouriteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
