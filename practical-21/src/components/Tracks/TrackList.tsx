import React from 'react';
import type { Track } from '../../types/api';
import TrackCard from './TrackCard';
import Loading from '../UI/Loading';

interface Props {
  tracks: Track[];
  loading: boolean;
}

const TrackList: React.FC<Props> = ({ tracks, loading }) => {

  if (loading) return <Loading />;

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          All Tracks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackList;

