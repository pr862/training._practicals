import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import MainLayout from '../components/Layout/MainLayout';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PlaylistsPage from '../pages/PlaylistsPage';
import FavouritesPage from '../pages/FavouritesPage';
import Hero from '../components/Home/Hero';
import FeaturedTracks from '../components/Home/FeaturedTracks';
import FeaturedArtists from '../components/Home/FeaturedArtists';
import FeaturedAlbums from '../components/Home/FeaturedAlbums';
import TrackList from '../components/Tracks/TrackList';
import ArtistList from '../components/Artists/ArtistList';
import AlbumList from '../components/Albums/AlbumList';

import { useTracks } from '../hooks/useTracks';
import { useArtists } from '../hooks/useArtists';
import { useAlbums } from '../hooks/useAlbums';

const TracksPage: React.FC = () => {
  const { tracks, loading } = useTracks();
  return <TrackList tracks={tracks} loading={loading} />;
};

const ArtistsPage: React.FC = () => {
  const { artists, loading } = useArtists();
  return <ArtistList artists={artists} loading={loading} />;
};

const AlbumsPage: React.FC = () => {
  const { albums, loading } = useAlbums();
  return <AlbumList albums={albums} loading={loading} />;
};

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
          { path: 'albums', element: <AlbumsPage /> },
          { path: 'playlists', element: <PlaylistsPage /> },
          { path: 'favourites', element: <FavouritesPage /> },
        ],
      },
    ],
  },
]);

