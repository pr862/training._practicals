import React from "react";
import TrackList from "../components/Tracks/TrackList";
import { useTracks } from "../hooks/useTracks";

const TracksPage: React.FC = () => {
  const { tracks, loading } = useTracks();

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold mb-8">All Tracks</h1>
      <TrackList tracks={tracks} loading={loading} variant="grid" title="All Tracks" />
    </div>
  );
};

export default TracksPage;
