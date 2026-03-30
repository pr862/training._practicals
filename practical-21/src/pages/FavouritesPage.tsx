import React from 'react';
import { useFavourites } from '../hooks/useFavourites';
import TrackList from '../components/Tracks/TrackList';

const FavouritesPage: React.FC = () => {
  const { favourites, loading, error } = useFavourites();

  const favTracks = favourites.map((f) => f.track);

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-8">All Favourites</h1>
      {error && <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>}
      {loading ? (
        <TrackList tracks={favTracks} loading={true} title="All Favourites" />
      ) : favTracks.length === 0 ? (
        <div className="px-4 md:px-0 text-gray-400">No favourite tracks yet</div>
      ) : (
        <TrackList tracks={favTracks} loading={false} title="All Favourites" />
      )}
    </div>
  );
};

export default FavouritesPage;
