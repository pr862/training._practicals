import React from 'react';
import type { Artist } from '../../types/api';
import ArtistCard from './ArtistCard';
import Loading from '../UI/Loading';

interface Props {
  artists: Artist[];
  loading: boolean;
}

const ArtistList: React.FC<Props> = ({ artists, loading }) => {

  if (loading) return <Loading />;

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          All Artists
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistList;

