import React from "react";
import TrackList from "../components/Tracks/TrackList";
import { useTracks } from "../hooks/useTracks";

const TracksPage: React.FC = () => {
  const { tracks, loading } = useTracks();

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <TrackList tracks={tracks} loading={loading} variant="grid" title="All Tracks" />
    </div>
  );
};

export default TracksPage;