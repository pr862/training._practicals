import React from 'react';
import { useArtists } from '../../hooks/useArtists';
import Loading from '../UI/Loading';

const FeaturedArtists: React.FC = () => {
  const { artists, loading } = useArtists();

  if (loading) return <Loading />;

  const featured = artists.slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
          Top Artists
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {featured.map((artist) => (
            <div key={artist.id} className="group cursor-pointer text-center">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-purple-400 to-pink-400 p-1">
                <img src={artist.image} alt={artist.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300" />
              </div>
              <p className="font-semibold mt-4 line-clamp-1">{artist.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtists;
