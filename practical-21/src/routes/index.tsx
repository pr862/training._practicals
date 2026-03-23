import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
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
import Hero from '../components/Home/Hero';
import FeaturedTracks from '../components/Home/FeaturedTracks';
import FeaturedArtists from '../components/Home/FeaturedArtists';
import FeaturedAlbums from '../components/Home/FeaturedAlbums';

// Router
export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <>
                <Hero />
                <FeaturedTracks />
                <FeaturedArtists />
                <FeaturedAlbums />
              </>
            ),
          },
          
          { path: 'tracks', element: <TracksPage /> },
          { path: 'artists', element: <ArtistsPage /> },
          { path: 'artists/:id', element: <ArtistPage /> },
          { path: 'albums', element: <AlbumsPage /> },
          { path: 'playlists', element: <PlaylistsPage /> },
          { path: 'favourites', element: <FavouritesPage /> },
          { path: 'search', element: <SearchPage /> },
        ],
      },
    ],
  },
]);

