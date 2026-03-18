import React from 'react';
import { usePlaylists } from '../hooks/usePlaylists';
// import TrackList from '../components/Tracks/TrackList'; // Not used

const PlaylistsPage: React.FC = () => {
  const { playlists, loading, error } = usePlaylists(); // Assume hook returns playlists with tracks

  return (
    <div className="p-6 space-y-6">
      {error && <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>}
      {/* For simplicity, list playlists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="p-4 border rounded-lg">
            <h3 className="font-bold">{playlist.title}</h3>
            <p>{playlist.tracks.length} tracks</p>
            {/* Add expand for tracks */}
          </div>
        ))}
      </div>
      {loading && <div>Loading playlists...</div>}
    </div>
  );
};

export default PlaylistsPage;

