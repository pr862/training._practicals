import React from 'react';
import ArtistCard from '../Artists/ArtistCard';
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
          Popular Artists
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {featured.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtists;
