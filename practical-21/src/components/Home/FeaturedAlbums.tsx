import React from 'react';
import { useAlbums } from '../../hooks/useAlbums';
import Loading from '../UI/Loading';

const FeaturedAlbums: React.FC = () => {
  const { albums, loading } = useAlbums();

  if (loading) return <Loading />;

  const featured = albums.slice(0, 6);

  if (featured.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
            New Releases
          </h2>
          <p className="text-center text-gray-500 text-lg">No albums available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
          New Releases
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {featured.map((album) => (
            <div key={album.id} className="group cursor-pointer bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border hover:border-blue-200">
              <img src={album.image} alt={album.title} className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300" />
              <h3 className="font-bold text-lg mb-1 line-clamp-1">{album.title}</h3>
              <p className="text-gray-600">{album.artistName} • {album.year || 'N/A'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )};

export default FeaturedAlbums;
