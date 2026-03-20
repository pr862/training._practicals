import React from 'react';
import type { Track } from '../../types/api';

interface TrackCardProps {
  track: Track;
  onPlay?: () => void;
}

const TrackCard: React.FC<TrackCardProps> = ({ track, onPlay }) => {

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).src =
      'https://via.placeholder.com/50';
  };

  const image = track.image || (track as any).image_url;
  const title = track.title || (track as any).name;

  return (
    <div
      onClick={onPlay}
      className="group flex items-center gap-4 p-3 rounded-md hover:bg-white/10 transition cursor-pointer"
    >

      <div className="relative w-12 h-12 flex-shrink-0">
        <img
          src={image}
          alt={title}
          onError={handleImageError}
          className="w-full h-full object-cover rounded"
        />
      </div>

      <div className="flex flex-col overflow-hidden">
        <p className="text-white text-sm font-medium truncate">
          {title || 'Unknown Track'}
        </p>
      </div>

    </div>
  );
};

export default TrackCard;