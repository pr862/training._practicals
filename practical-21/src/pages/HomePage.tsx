import React from 'react';
import Navbar from '../components/Layout/Navbar';
import { useTracks } from '../hooks/useTracks';
import { useArtists } from '../hooks/useArtists';
import { useAlbums } from '../hooks/useAlbums';
import { useNavigate } from 'react-router-dom';
import playIcon from '../assets/play.svg';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const { tracks = [], loading: tracksLoading } = useTracks();
  const { artists = [], loading: artistsLoading } = useArtists();
  const { albums = [], loading: albumsLoading } = useAlbums();

  const renderSkeleton = (count: number, type: 'square' | 'circle') => (
    <div className="flex gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${
            type === 'circle'
              ? 'w-36 h-36 rounded-full'
              : 'w-40 h-40 rounded-xl'
          } bg-gradient-to-r from-gray-900 via-gray-900 to-gray-900 animate-pulse flex-shrink-0`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="pt-24 px-6 md:px-10 pb-20 space-y-14">

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Trending songs</h2>
            <span className="text-sm text-gray-400 hover:text-white cursor-pointer">
              Show all
            </span>
          </div>

          {tracksLoading ? (
            renderSkeleton(8, 'square')
          ) : (
            <div className="flex gap-6 pb-2">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="group w-52 p-3 rounded-xl flex-shrink-0 cursor-pointer 
                  transition-all duration-300 hover:bg-neutral-700/60 hover:scale-[1.03]"
                >
                  <div className="relative">
                    <img
                      src={track.image}
                      alt={track.title}
                      className="w-full h-44 object-cover rounded-lg shadow-lg"
                    />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/login');
                      }}
                      className="absolute bottom-3 right-3 w-12 h-12  bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <img src={playIcon} alt="play" />
                    </button>
                  </div>

                  <div className="mt-3">
                    <p className="font-semibold text-sm truncate">
                      {track.title || 'Unknown'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Popular artists</h2>
            <span className="text-sm text-gray-400 hover:text-white cursor-pointer">
              Show all
            </span>
          </div>

          {artistsLoading ? (
            renderSkeleton(8, 'circle')
          ) : (
            <div className="flex gap-2 pb-2">
              {artists.map((artist) => (
                <div
                  key={artist.id}
                  onClick={() => navigate(`/app/artists/${artist.id}`)}
                  className="group w-52 p-3 rounded-xl flex-shrink-0 cursor-pointer text-center
                  transition-all duration-300 hover:bg-neutral-700/60 hover:scale-[1.03]"
                >
                  <div className="relative flex justify-center">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-40 h-40 rounded-full object-cover shadow-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/login');
                      }}
                      className="absolute bottom-3 right-3 w-12 h-12  bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                      <img src={playIcon} alt="play" />
                    </button>
                  </div>

                  <p className="mt-4 text-base font-semibold truncate">
                    {artist.name}
                  </p>
                  <p className="text-sm text-gray-400">Artist</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">New albums</h2>
            <span className="text-sm text-gray-400 hover:text-white cursor-pointer">
              Show all
            </span>
          </div>

          {albumsLoading ? (
            renderSkeleton(6, 'square')
          ) : (
            <div className="flex gap-6 pb-2">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="group w-52 p-3 rounded-xl flex-shrink-0 cursor-pointer 
                  transition-all duration-300 hover:bg-neutral-700/60 hover:scale-[1.03]"
                >
                  <div className="relative">
                    <img
                      src={album.image}
                      alt={album.title}
                      className="w-full h-44 object-cover rounded-lg shadow-lg"
                    />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/login');
                      }}
                      className="absolute bottom-3 right-3 w-12 h-12  bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300"
                    >
                      <img src={playIcon} alt="play" />
                    </button>
                  </div>

                  <div className="mt-3">
                    <p className="font-semibold text-sm truncate">
                      {album.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {album.artistName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default HomePage;