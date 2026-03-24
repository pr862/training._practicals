import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlbums } from '../hooks/useAlbums';
import { useTracks } from '../hooks/useTracks';
import TrackList from '../components/Tracks/TrackList';
import NotFoundPage from './NotFoundPage';
import Loading from '../components/UI/Loading';

const AlbumDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { albums, loading: albumsLoading, error: albumsError } = useAlbums();
  const { tracks, loading: tracksLoading, error: tracksError } = useTracks();

  const album = useMemo(() => {
    if (!id) return undefined;
    return albums.find((a) => String(a.id) === id);
  }, [albums, id]);

  const albumTracks = useMemo(() => {
    if (!album) return [];
    return tracks.filter((t) => typeof t.albumId === 'number' && t.albumId === album.id);
  }, [album, tracks]);

  if (!id) return <NotFoundPage />;

  if (albumsLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Loading fullScreen label="Loading album..." />
      </div>
    );
  }

  if (!album) {
    return <NotFoundPage />;
  }

  return (
    <div className="w-full pt-20 bg-gradient-to-r from-purple-700/80 to-emerald-600/30 backdrop-blur-lg text-white">
      <div className="relative w-full overflow-hidden">
        <div className="absolute inset-0 blur-3xl" />

        <div className="relative w-full px-4 md:px-10 py-16">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-10">
            <div className="w-44 h-44 md:w-60 md:h-60 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black/20">
              <img
                src={album.image}
                alt={album.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm uppercase tracking-wide text-gray-200/80">Album</p>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 truncate">
                {album.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-200/80">
                <button
                  onClick={() => navigate(`/app/artists/${album.artistId}`)}
                  className="hover:text-white transition-colors underline-offset-4 hover:underline"
                  title="Open artist"
                >
                  {album.artistName || 'Unknown Artist'}
                </button>
                {typeof album.year === 'number' ? <span>• {album.year}</span> : null}
                <span>• {albumTracks.length} tracks</span>
              </div>

              {(albumsError || tracksError) ? (
                <div className="mt-4 text-sm text-rose-200/90">
                  {albumsError || tracksError}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-neutral-900 px-4 md:px-10 pb-24">
        <div className="pt-6">
          <TrackList
            tracks={albumTracks}
            loading={tracksLoading}
            variant="grid"
            title="Tracks"
          />
        </div>
      </div>
    </div>
  );
};

export default AlbumDetailsPage;

