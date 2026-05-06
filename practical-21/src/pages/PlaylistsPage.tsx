import React from "react";
import { usePlaylists } from "../hooks/usePlaylists";
import PlaylistList from "../components/Playlists/PlaylistList";

const PlaylistsPage: React.FC = () => {
  const { playlists, loading, error } = usePlaylists();

  return (
    <div className="bg-black min-h-screen text-white p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">All Playlists</h1>
      {error && <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>}

      <PlaylistList playlists={playlists} loading={loading} variant="grid" title="All Playlists" />
    </div>
  );
};

export default PlaylistsPage;
