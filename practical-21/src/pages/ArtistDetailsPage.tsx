import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { artistService } from '../services/artist';
import { useArtistTracks } from '../hooks/useArtists';
import { useArtistAlbums } from '../hooks/useAlbums';
import { getImageUrl } from '../utils/imageHelper';
import TrackList from '../components/Tracks/TrackList';
import AlbumList from '../components/Albums/AlbumList';
import type { Artist } from '../types/api';
import Loading from '../components/UI/Loading';
import Button from '../components/UI/Button';
import { Play, Shuffle,ArrowLeft } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { playTrack, setQueue, setShuffle } from '../store/playerSlice';

const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const autoplayedRef = useRef(false);

  const {
    tracks,
    loading: tracksLoading,
    error: tracksError
  } = useArtistTracks(id || '');

  const {
    albums,
    loading: albumsLoading,
    error: albumsError
  } = useArtistAlbums(id || '');

  const [artist, setArtist] = useState<Artist | null>(null);
  const [artistLoading, setArtistLoading] = useState(true);
  const [artistError, setArtistError] = useState('');

  const autoplayMode = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const autoplay = params.get('autoplay');
    const shuffle = params.get('shuffle');
    if (autoplay === '1' || autoplay === 'true') return shuffle === '1' || shuffle === 'true' ? 'shuffle' : 'play';
    return null;
  }, [location.search]);

  const startPlayback = useCallback((mode: 'play' | 'shuffle') => {
    const playable = (tracks || []).filter((t) => Boolean(t.audioUrl));
    if (playable.length === 0) return;

    const startIndex = mode === 'shuffle' ? Math.floor(Math.random() * playable.length) : 0;
    dispatch(setShuffle(mode === 'shuffle'));
    dispatch(setQueue({ tracks: playable, startIndex }));
    dispatch(playTrack(playable[startIndex]));
  }, [dispatch, tracks]);

  useEffect(() => {
    if (!id) return;

    const fetchArtist = async () => {
      try {
        setArtistLoading(true);
        setArtistError('');

        const response = await artistService.getById(id);
        const apiData = response.data as unknown as { success?: unknown; data?: unknown; message?: unknown };

        const success = apiData?.success === true;
        const data = apiData?.data as Record<string, unknown> | undefined;

        if (success && data) {
          const a = data;

          setArtist({
            id: Number(a.id),
            name: String(a.name ?? ''),
            image: getImageUrl(String((a.image_url ?? a.image) ?? '')),
            description: typeof a.description === 'string' ? a.description : ''
          });
        } else {
          setArtistError(typeof apiData?.message === 'string' ? apiData.message : 'Failed to fetch artist');
        }
      } catch {
        setArtistError('Failed to fetch artist');
      } finally {
        setArtistLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  useEffect(() => {
    if (!autoplayMode) return;
    if (autoplayedRef.current) return;
    if (tracksLoading) return;

    const playable = (tracks || []).filter((t) => Boolean(t.audioUrl));
    if (playable.length === 0) return;

    autoplayedRef.current = true;
    startPlayback(autoplayMode);
  }, [autoplayMode, startPlayback, tracks, tracksLoading]);

  if (artistLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Loading fullScreen />
      </div>
    );
  }

 return (
  <div className="w-full text-white">

    <div className="w-full bg-gradient-to-b from-teal-600/90 to-transparent">
      {artist && (
        <div className="relative w-full overflow-hidden">
          <div className="relative w-full px-4 md:px-10 py-20">
            <button
              onClick={() => navigate(-1)}
              className="mb-6 p-2 rounded-full hover:bg-white/10"
            >
              <ArrowLeft />
            </button>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-10">

              <div className="w-40 h-40 md:w-60 md:h-60 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-white bg-clip-text text-transparent">
                  {artist.name}
                </h1>

                <p className="text-lg uppercase text-gray-300 mb-2">
                  Artist
                </p>

                {artist.description && (
                  <p className="text-gray-400 max-w-2xl">
                    {artist.description}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => startPlayback('play')}
                    disabled={tracksLoading || tracks.length === 0}
                    className="bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 text-black rounded-full px-6"
                  >
                    <Play className="w-4 h-4 mr-2" /> Play
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => startPlayback('shuffle')}
                    disabled={tracksLoading || tracks.length === 0}
                    className="rounded-full px-6"
                  >
                    <Shuffle className="w-4 h-4 mr-2" /> Shuffle
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>

    {(artistError || tracksError || albumsError) && (
      <div className="text-red-400 text-center py-4">
        {artistError || tracksError || albumsError}
      </div>
    )}

    <div className="w-full px-4 md:px-10 pb-20 min-h-screen">
      
      <div className="mb-12 pt-5">
        <TrackList 
          tracks={tracks} 
          loading={tracksLoading} 
          variant="grid"
          title={`${artist?.name}'s Tracks`}
        />
      </div>

      <div>
        <AlbumList albums={albums} loading={albumsLoading} />
      </div>

    </div>
  </div>
);
};

export default ArtistPage;
