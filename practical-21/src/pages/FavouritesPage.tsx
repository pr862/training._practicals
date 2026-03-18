import React from 'react';
import { useFavourites } from '../hooks/useFavourites';
import TrackList from '../components/Tracks/TrackList';

const FavouritesPage: React.FC = () => {
  const { favourites, loading, error } = useFavourites(); // Assume returns {favourites: FavouriteTrack[], ...} with track data

  const favTracks = favourites.map(f => f.track);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Favourites</h1>
      {error && <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>}
      <TrackList tracks={favTracks} loading={loading} />
    </div>
  );
};

export default FavouritesPage;

