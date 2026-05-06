import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PlaylistsPage from '../pages/PlaylistsPage';
import FavouritesPage from '../pages/FavouritesPage';
import ArtistPage from '../pages/ArtistDetailsPage';
import SearchPage from '../pages/SearchPage';
import ArtistsPage from '../pages/ArtistsPage';
import TracksPage from '../pages/TracksPage';
import AlbumsPage from '../pages/AlbumsPage';
import TrackDetailsPage from '../pages/TrackDetailsPage';
import AlbumDetailsPage from '../pages/AlbumDetailsPage';
import NotFoundPage from '../pages/NotFoundPage';
import RouteErrorPage from '../pages/RouteErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/app',
        element: <MainLayout />,
        errorElement: <RouteErrorPage />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          
          { path: 'tracks', element: <TracksPage /> },
          { path: 'tracks/:id', element: <TrackDetailsPage /> },
          { path: 'artists', element: <ArtistsPage /> },
          { path: 'artists/:id', element: <ArtistPage /> },
          { path: 'albums', element: <AlbumsPage /> },
          { path: 'albums/:id', element: <AlbumDetailsPage /> },
          { path: 'playlists', element: <PlaylistsPage /> },
          { path: 'favourites', element: <FavouritesPage /> },
          { path: 'search', element: <SearchPage /> },
          { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
