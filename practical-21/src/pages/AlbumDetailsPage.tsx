import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAlbums } from '../hooks/useAlbums';
import { useTracks } from '../hooks/useTracks';
import TrackList from '../components/Tracks/TrackList';
import NotFoundPage from './NotFoundPage';
import Loading from '../components/UI/Loading';
import Button from '../components/UI/Button';
import { Play, Shuffle,ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { playTrack, setQueue, setShuffle } from '../store/playerSlice';

const AlbumDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const autoplayedRef = useRef(false);

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

  const autoplayMode = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const autoplay = params.get('autoplay');
    const shuffle = params.get('shuffle');
    if (autoplay === '1' || autoplay === 'true') return shuffle === '1' || shuffle === 'true' ? 'shuffle' : 'play';
    return null;
  }, [location.search]);

  const startPlayback = useCallback((mode: 'play' | 'shuffle') => {
    const playable = albumTracks.filter((t) => Boolean(t.audioUrl));
    if (playable.length === 0) return;

    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const startIndex = mode === 'shuffle' ? Math.floor(Math.random() * playable.length) : 0;
    dispatch(setShuffle(mode === 'shuffle'));
    dispatch(setQueue({ tracks: playable, startIndex }));
    dispatch(playTrack(playable[startIndex]));
  }, [albumTracks, dispatch, isAuthenticated, location, navigate]);

  useEffect(() => {
    if (!autoplayMode) return;
    if (autoplayedRef.current) return;
    if (tracksLoading || albumsLoading) return;

    const playable = albumTracks.filter((t) => Boolean(t.audioUrl));
    if (playable.length === 0) return;

    autoplayedRef.current = true;
    startPlayback(autoplayMode);
  }, [albumsLoading, albumTracks, autoplayMode, startPlayback, tracksLoading]);

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
  <div className="w-full text-white">

    <div className="w-full bg-gradient-to-b from-purple-700/80 to-transparent">
      <div className="relative w-full overflow-hidden">
        
        <div className="relative w-full px-4 md:px-10 py-20">

          <button
              onClick={() => navigate(-1)}
              className="mb-6 p-2 rounded-full hover:bg-white/10"
            >
              <ArrowLeft />
            </button>

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
                >
                  {album.artistName || "Unknown Artist"}
                </button>

                {typeof album.year === "number" && <span>• {album.year}</span>}
                <span>• {albumTracks.length} tracks</span>
              </div>

              {(albumsError || tracksError) && (
                <div className="mt-4 text-sm text-rose-200/90">
                  {albumsError || tracksError}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => startPlayback("play")}
                  disabled={tracksLoading || albumTracks.length === 0}
                  className="bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 text-black rounded-full px-6"
                >
                  <Play className="w-4 h-4 mr-2" /> Play
                </Button>

                <Button
                  variant="outline"
                  onClick={() => startPlayback("shuffle")}
                  disabled={tracksLoading || albumTracks.length === 0}
                  className="rounded-full px-6"
                >
                  <Shuffle className="w-4 h-4 mr-2" /> Shuffle
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="w-full px-4 md:px-10 pb-24 min-h-screen">
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
