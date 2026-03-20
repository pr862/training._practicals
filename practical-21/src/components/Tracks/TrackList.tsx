import React from 'react';
import { useDispatch } from 'react-redux';
import type { Track } from '../../types/api';
import TrackCard from './TrackCard';
import Loading from '../UI/Loading';
import { playTrack } from '../../store/playerSlice';

interface Props {
  tracks: Track[];
  loading: boolean;
}

const TrackList: React.FC<Props> = ({ tracks, loading }) => {
  const dispatch = useDispatch();

  if (loading) return <Loading />;

  return (
    <div>
      <div className="max-w-full pt-10 mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-100 mb-3">
          Tracks
        </h2>
        <p className="text-gray-300 mb-3">
          {tracks.length} Tracks
        </p>
        <div className="grid grid-rows-3 gap-4">
          {tracks.map((track) => (
            <TrackCard 
              key={track.id} 
              track={track} 
              onPlay={() => dispatch(playTrack(track))}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackList;

