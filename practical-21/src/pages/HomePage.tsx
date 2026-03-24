import React, { useMemo } from 'react';
import Navbar from '../components/Layout/Navbar';
import { useTracks } from '../hooks/useTracks';
import { useArtists } from '../hooks/useArtists';
import { useAlbums } from '../hooks/useAlbums';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import { Play, Shuffle } from 'lucide-react';
import ArtistList from '../components/Artists/ArtistList';
import AlbumList from '../components/Albums/AlbumList';
import TrackList from '../components/Tracks/TrackList';
import { useDispatch, useSelector } from 'react-redux';
import { playTrack, setQueue, setShuffle } from '../store/playerSlice';
import type { RootState } from '../store/store';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { tracks = [], loading: tracksLoading } = useTracks();
  const { artists = [], loading: artistsLoading } = useArtists();
  const { albums = [], loading: albumsLoading } = useAlbums();

  const query = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('q') || '').trim();
  }, [location.search]);

  const filteredTracks = useMemo(() => {
    if (!query) return tracks;
    const q = query.toLowerCase();
    return tracks.filter((t) => (t.title || '').toLowerCase().includes(q));
  }, [query, tracks]);

  const filteredArtists = useMemo(() => {
    if (!query) return artists;
    const q = query.toLowerCase();
    return artists.filter((a) => (a.name || '').toLowerCase().includes(q));
  }, [query, artists]);

  const filteredAlbums = useMemo(() => {
    if (!query) return albums;
    const q = query.toLowerCase();
    return albums.filter(
      (a) =>
        (a.title || '').toLowerCase().includes(q) ||
        (a.artistName || '').toLowerCase().includes(q)
    );
  }, [query, albums]);

  const startPlayback = (mode: 'play' | 'shuffle') => {
    const playable = tracks.filter((t) => Boolean(t.audioUrl));
    if (playable.length === 0) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/' } } });
      return;
    }
    const startIndex = mode === 'shuffle' ? Math.floor(Math.random() * playable.length) : 0;
    dispatch(setShuffle(mode === 'shuffle'));
    dispatch(setQueue({ tracks: playable, startIndex }));
    dispatch(playTrack(playable[startIndex]));
    navigate(`/app/tracks/`);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />
      <section className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-24 ">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&h=700&fit=crop"
            alt="Hero"
            className="w-full h-[70vh] object-cover scale-105 hover:scale-110 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="relative px-6 sm:px-10 lg:px-14 py-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold max-w-2xl">
            Feel the Beat, Live the Moment
          </h1>

          <p className="mt-4 text-lg text-gray-300 max-w-xl">
            Discover trending tracks and your next favorite artist.
          </p>

          <div className="flex gap-4 mt-10">
            <Button onClick={() => startPlayback('play')} className="flex items-center gap-2 px-6">
              <Play className="w-5 h-5" /> Play Now
            </Button>

            <Button onClick={() => startPlayback('shuffle')} variant="outline" className="flex items-center gap-2 px-6">
              <Shuffle className="w-5 h-5" /> Shuffle
            </Button>
          </div>
        </div>
      </section>

      <main className="pt-14 px-6 md:px-10 pb-20 space-y-14">
        {query ? (
          <>
            <div className="px-4 md:px-0">
              <h2 className="text-2xl font-bold">Results for “{query}”</h2>
            </div>

            {filteredTracks.length > 0 ? (
              <TrackList tracks={filteredTracks} loading={tracksLoading} variant="grid" title="Tracks" />
            ) : (
              <div className="px-4 md:px-0 text-gray-400">No tracks found.</div>
            )}

            {filteredArtists.length > 0 ? (
              <ArtistList artists={filteredArtists} loading={artistsLoading} variant="grid" title="Artists" />
            ) : (
              <div className="px-4 md:px-0 text-gray-400">No artists found.</div>
            )}

            {filteredAlbums.length > 0 ? (
              <AlbumList albums={filteredAlbums} loading={albumsLoading} variant="grid" title="Albums" />
            ) : (
              <div className="px-4 md:px-0 text-gray-400">No albums found.</div>
            )}
          </>
        ) : (
          <>
            <TrackList
              tracks={tracks}
              loading={tracksLoading}
              variant="slider"
              title="Trending Tracks"
              onShowAll={() => navigate("/app/tracks")}
            />

            <ArtistList artists={artists} loading={artistsLoading} variant="slider" title="Popular Artists" />

            <AlbumList albums={albums} loading={albumsLoading} variant="slider" title="New Albums" />
          </>
        )}
      </main>
    </div>
  );
};

export default HomePage;
