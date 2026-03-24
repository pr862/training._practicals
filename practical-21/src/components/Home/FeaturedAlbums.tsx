import React from 'react';
import { useAlbums } from '../../hooks/useAlbums';
import Loading from '../UI/Loading';
import AlbumCard from '../Albums/AlbumCard';

const FeaturedAlbums: React.FC = () => {
  const { albums, loading } = useAlbums();

  if (loading) return <Loading />;

  const featured = albums.slice(0, 6);

  if (featured.length === 0) {
    return (
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">
            New Releases
          </h2>
          <p className="text-center text-white/70 text-lg">No albums available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-10">
          New Releases
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {featured.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </div>
    </section>
  )};

export default FeaturedAlbums;
