import React from 'react';
import { useArtists } from '../hooks/useArtists';
import ArtistList from '../components/Artists/ArtistList';

const ArtistsPage: React.FC = () => {
  const { artists, loading, error } = useArtists();

  return (
    <div className="p-6 space-y-6">
      {error && <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>}
      <ArtistList artists={artists} loading={loading} />
    </div>
  );
};

export default ArtistsPage;

