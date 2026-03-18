import React from 'react';
import type { Track } from '../../types/api';
import Button from '../UI/Button';

interface TrackCardProps {
  track: Track;
  onPlay?: () => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, onPlay }) => {
  return (
    <div className="group cursor-pointer bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border hover:border-purple-200 flex flex-col h-full">
      <div className="relative mb-4">
        <img src={track.image} alt={track.title} className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-end p-4">
          <Button onClick={onPlay} size="sm" className="w-full opacity-90">Play</Button>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{track.title}</h3>
        <p className="text-gray-600 mb-2">{track.artist.name}</p>
        <p className="text-sm text-gray-500">{track.duration} • {track.plays.toLocaleString()} plays</p>
      </div>
    </div>
  );
};

export default TrackCard;
