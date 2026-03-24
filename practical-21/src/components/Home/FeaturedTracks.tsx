import React from 'react';
import { useTracks } from '../../hooks/useTracks';
import Loading from '../UI/Loading';

const FeaturedTracks: React.FC = () => {
  const { tracks, loading } = useTracks();

  if (loading) return <Loading />;

  const featured = tracks.slice(0, 8);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
          Featured Tracks
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((track) => (
            <div key={track.id} className="group cursor-pointer bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border hover:border-purple-200">
              <img src={track.image} alt={track.title} className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform duration-300" />
              <h3 className="font-bold text-lg mb-1 line-clamp-1">{track.title}</h3>
              <p className="text-sm text-gray-500">{(typeof track.plays === 'number' ? track.plays : 0).toLocaleString()} plays</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTracks;
