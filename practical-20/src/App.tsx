import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RequireAuth } from './context/RequireAuth';
import { AdminLayout } from './layout/AdminLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/users/UsersPage';
import { ArtistsPage } from './pages/artists/ArtistsPage';
import { AlbumsPage } from './pages/albums/AlbumsPage';
import { AlbumDetailPage } from './pages/albums/AlbumDetailPage';
import { TracksPage } from './pages/tracks/TracksPage';
import { PlaylistsPage } from './pages/playlists/PlaylistsPage';
import { PlaylistDetailPage } from './pages/playlists/PlaylistDetailPage';
import { ConfirmProvider } from './components/ui/ConfirmProvider';

const App: React.FC = () => {
  return (
    <ConfirmProvider>
      <div className="h-screen overflow-hidden flex flex-col">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<RequireAuth />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/artists" element={<ArtistsPage />} />
              <Route path="/albums" element={<AlbumsPage />} />
              <Route path="/albums/:albumId" element={<AlbumDetailPage />} />
              <Route path="/tracks" element={<TracksPage />} />
              <Route path="/playlists" element={<PlaylistsPage />} />
              <Route path="/playlists/:playlistId" element={<PlaylistDetailPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ConfirmProvider>
  );
};

export default App;
