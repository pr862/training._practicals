import React from 'react';
import Navbar from '../components/Layout/Navbar';
import { useTracks } from '../hooks/useTracks';
import { useArtists } from '../hooks/useArtists';
import { useAlbums } from '../hooks/useAlbums';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import { Play, Shuffle } from 'lucide-react';
import ArtistList from '../components/Artists/ArtistList';
import AlbumList from '../components/Albums/AlbumList';
import TrackList from '../components/Tracks/TrackList';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { tracks = [], loading: tracksLoading } = useTracks();
  const { artists = [], loading: artistsLoading } = useArtists();
  const { albums = [], loading: albumsLoading } = useAlbums();

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
            <Button className="flex items-center gap-2 px-6">
              <Play className="w-5 h-5" /> Play Now
            </Button>

            <Button variant="outline" className="flex items-center gap-2 px-6">
              <Shuffle className="w-5 h-5" /> Shuffle
            </Button>
          </div>
        </div>
      </section>

      <main className="pt-14 px-6 md:px-10 pb-20 space-y-14">
        <TrackList
          tracks={tracks}
          loading={tracksLoading}
          variant="slider"
          title="Trending Tracks"
          onShowAll={() => navigate("/app/tracks")}
        />

        <ArtistList artists={artists} loading={artistsLoading} variant="slider" />

        <AlbumList albums={albums} loading={albumsLoading} variant="slider" title="New Albums" />
      </main>
    </div>
  );
};

export default HomePage;
