import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { adminUsersApi } from '../api/admin/users';
import { adminArtistsApi } from '../api/admin/artists';
import { adminAlbumsApi } from '../api/admin/albums';
import { adminTracksApi } from '../api/admin/tracks';
import { adminPlaylistsApi } from '../api/admin/playlists';
import { useToast } from '../context/ToastProvider';

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const { error: toastError } = useToast();
  const [stats, setStats] = useState<{
    users: number;
    artists: number;
    albums: number;
    tracks: number;
    playlists: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [users, artists, albums, tracks, playlists] = await Promise.all([
          adminUsersApi.list(),
          adminArtistsApi.list(),
          adminAlbumsApi.list(),
          adminTracksApi.list(),
          adminPlaylistsApi.list(),
        ]);
        if (cancelled) return;
        setStats({
          users: users.length,
          artists: artists.length,
          albums: albums.length,
          tracks: tracks.length,
          playlists: playlists.length,
        });
      } catch (e: any) {
        if (!cancelled) toastError(e?.message ?? 'Failed to load dashboard stats');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const Card: React.FC<{ label: string; value: React.ReactNode; to: string }> = ({
    label,
    value,
    to,
  }) => (
    <Link
      to={to}
      className="group rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/7"
    >
      <div className="text-xs font-medium uppercase tracking-wide text-white/50">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-white">{value}</div>
      <div className="mt-2 text-xs font-medium text-teal-300 group-hover:text-teal-200">
        View →
      </div>
    </Link>
  );

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card label="Users" to="/users" value={loading ? '—' : stats?.users ?? '—'} />
        <Card label="Artists" to="/artists" value={loading ? '—' : stats?.artists ?? '—'} />
        <Card label="Albums" to="/albums" value={loading ? '—' : stats?.albums ?? '—'} />
        <Card label="Tracks" to="/tracks" value={loading ? '—' : stats?.tracks ?? '—'} />
        <Card label="Playlists" to="/playlists" value={loading ? '—' : stats?.playlists ?? '—'} />
      </div>

    </div>
  );
};
